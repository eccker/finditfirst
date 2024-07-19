//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;
pragma abicoder v2; // required to accept structs as function parameters

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFIFTicket {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function mint(address to, uint256 amount) external;

    function burn(uint256 amount) external;
}

contract FIFGAME is EIP712, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOMAIN = "FIND-IT-FIRST";
    string private constant SIGNATURE_VERSION = "1";

    IERC20 public fifToken; // Standard ERC-20 Token
    IFIFTicket public fifTicket; // Internal ERC-20 Token (Ticket)

    mapping(address => uint256) public balances; // Saldo de tokens de cada jugador
    mapping(uint256 => bool) public vouchers; // Indica si un jugador tiene un voucher
    mapping(address => bool) public canPlay; // Indica si un jugador puede jugar porque ya pagó

    address public AUTHOR_ADDRESS = 0x090Ec11314d4BD31B536F52472d2E6A1D4771220;
    address public DAO_TREASURY_ADDRESS = 0x88c7CE98b4924c7eA58F160D3A128e0592ECB053;
    address public DAO_FUND_ADDRESS = 0x2696b670D795e3B524880402C67b1ACCe6C1860f;
    address public DEVELOPER_ADDRESS = 0x2696b670D795e3B524880402C67b1ACCe6C1860f;
    address public ARTISTS_ADDRESS = 0x2696b670D795e3B524880402C67b1ACCe6C1860f;
    uint256 public TOKEN_TO_TICKET_RATE = 1 ether;
    
    struct WinnerVoucher {
        uint256 voucherId;
        uint256 winnerReward;
        uint256 winnerBet;
        string winnerAddress;
        bytes signature;
    }

    event TransferTokens(address indexed player, uint256 amount);
    event GameMatchStarted(address indexed player, uint256 betAmount);
    event RewardRedeemed(address indexed player, uint256 amount);

    constructor( ) EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function setTokenAndTicketAddress(address _FIFTokenAddress, address _FIFTicketAddress) external onlyRole(MINTER_ROLE) {
        fifToken = IERC20(_FIFTokenAddress);
        fifTicket = IFIFTicket(_FIFTicketAddress);
    }

    function setTokenToTicketRate(uint256 rate) external onlyRole(MINTER_ROLE) {
        TOKEN_TO_TICKET_RATE = rate;
    }

    function mintTickets(uint256 amount) external {
    // TODO function to mint Tickets from Tokens
        require(
            amount % TOKEN_TO_TICKET_RATE == 0,
            "Must send a multiple of the T2TR"
        );

        require(
            fifToken.transferFrom(msg.sender, address(this), amount),
            "Error en la transferencia"
        );

        fifTicket.mint(msg.sender, amount);
        // TODO prevent ticket withdraw
        // TODO prevent ticket transfer
        console.log("SC ::: FIFTicket minted: mintTickets", msg.sender, amount);

    }

    function startGameMatch(uint256 _ticketsToBet) external {
        console.log("SC ::: START: startGameMatch", msg.sender);
        require(
            _ticketsToBet % 1 ether == 0,
            "Must send a multiple of the T2TR"
        );

        require(
            fifTicket.transferFrom(msg.sender, address(this), _ticketsToBet),
            "Error en la transferencia"
        );
        fifTicket.burn(_ticketsToBet);
        emit GameMatchStarted(msg.sender, _ticketsToBet);
        console.log("SC ::: END of startGameMatch");
    }

    function redeem(WinnerVoucher calldata voucher) public {
        // make sure signature is valid and get the address of the signer
        address signer = _verify(voucher);

        // make sure that the signer is authorized to mint NFTs
        require(
            hasRole(MINTER_ROLE, signer),
            "Signature invalid or unauthorized"
        );

        require(vouchers[voucher.voucherId] != true, "Voucher spent");

        vouchers[voucher.voucherId] = true;

        // TODO partition the Reward to cover FIF fee
        uint256 _amountOfFIFCoinForAuthor = ((2128623629 * 10 ** 9) * voucher.winnerReward) / 10 ** 20; //  2.128623629 % BMMM3SC Author
        uint256 _amountOfFIFCoinForTreasury = ((2461179748 * 10 ** 9) * voucher.winnerReward) / 10 ** 20; //  2.461179748 % BMMM3SC Treasury
        uint256 _amountOfFIFCoinForWinner = ((91803398874 * 10 ** 9) * voucher.winnerReward) / 10 ** 20; // 91.803398874 % BMMM3SC Sender
        uint256 _amountOfFIFCoinForDAO = ((3606797749 * 10 ** 9) * voucher.winnerReward) / 10 ** 20; //  3.606797749 % BMMM3SC DAO

        fifToken.approve(AUTHOR_ADDRESS, _amountOfFIFCoinForAuthor); //42572472580000000
        fifToken.transfer(AUTHOR_ADDRESS, _amountOfFIFCoinForAuthor);

        fifToken.approve(DAO_TREASURY_ADDRESS, _amountOfFIFCoinForTreasury);
        fifToken.transfer(DAO_TREASURY_ADDRESS, _amountOfFIFCoinForTreasury);

        fifToken.approve(DAO_FUND_ADDRESS, _amountOfFIFCoinForDAO);
        fifToken.transfer(DAO_FUND_ADDRESS, _amountOfFIFCoinForDAO);

        fifToken.approve(stringToAddress(voucher.winnerAddress), _amountOfFIFCoinForWinner);
        fifToken.transfer(address(stringToAddress(voucher.winnerAddress)), _amountOfFIFCoinForWinner);
        emit RewardRedeemed(stringToAddress(voucher.winnerAddress), _amountOfFIFCoinForWinner);
    }

    function stringToAddress(string calldata s) public pure returns (address) {
        bytes memory _bytes = hexStringToAddress(s);
        require(_bytes.length >= 1 + 20, "toAddress_outOfBounds");
        address tempAddress;

        assembly {
            tempAddress := div(
                mload(add(add(_bytes, 0x20), 1)),
                0x1000000000000000000000000
            )
        }

        return tempAddress;
    }

    function hexStringToAddress( string calldata s) public pure returns (bytes memory) {
        bytes memory ss = bytes(s);
        require(ss.length % 2 == 0); // length must be even
        bytes memory r = new bytes(ss.length / 2);
        for (uint i = 0; i < ss.length / 2; ++i) {
            r[i] = bytes1(
                fromHexChar(uint8(ss[2 * i])) *
                    16 +
                    fromHexChar(uint8(ss[2 * i + 1]))
            );
        }

        return r;
    }

    function fromHexChar(uint8 c) public pure returns (uint8) {
        if (bytes1(c) >= bytes1("0") && bytes1(c) <= bytes1("9")) {
            return c - uint8(bytes1("0"));
        }
        if (bytes1(c) >= bytes1("a") && bytes1(c) <= bytes1("f")) {
            return 10 + c - uint8(bytes1("a"));
        }
        if (bytes1(c) >= bytes1("A") && bytes1(c) <= bytes1("F")) {
            return 10 + c - uint8(bytes1("A"));
        }
        return 0;
    }

    function _hash(WinnerVoucher calldata voucher) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "WinnerVoucher(uint256 voucherId,uint256 winnerReward,uint256 winnerBet,string winnerAddress)"
                        ),
                        voucher.voucherId,
                        voucher.winnerReward,
                        voucher.winnerBet,
                        keccak256(bytes(voucher.winnerAddress))
                    )
                )
            );
    }

    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function _verify(WinnerVoucher calldata voucher) internal view returns (address) {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, voucher.signature);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
        return AccessControl.supportsInterface(interfaceId);
    }
}
