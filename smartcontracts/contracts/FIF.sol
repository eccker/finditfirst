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

contract FIF is EIP712, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOMAIN = "FIND-IT-FIRST";
    string private constant SIGNATURE_VERSION = "1";

    IERC20 public token; // Token ERC-20 utilizado en el juego

    mapping(address => uint256) public balances; // Saldo de tokens de cada jugador
    mapping(uint256 => bool) public vouchers; // Indica si un jugador tiene un voucher
    mapping(address => bool) public canPlay; // Indica si un jugador puede jugar porque ya pagó

    address public authorAddress = 0x090Ec11314d4BD31B536F52472d2E6A1D4771220;
    address public treasuryAddress = 0x88c7CE98b4924c7eA58F160D3A128e0592ECB053;
    address public DAOAddress = 0x2696b670D795e3B524880402C67b1ACCe6C1860f;

    // mapping(address => uint256) pendingWithdrawals;
    event TransferTokens(address indexed player, uint256 amount);
    event RewardRedeemed(address indexed player, uint256 amount);

    constructor(
        address _tokenAddress
    ) EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        _grantRole(MINTER_ROLE, msg.sender);
        token = IERC20(_tokenAddress);
    }

    /// @notice Represents winner's reward, which has not yet been recorded into the blockchain. A signed voucher can be redeemed for tokens using the redeem function.
    struct WinnerVoucher {
        uint256 voucherId;
        uint256 winnerReward;
        uint256 winnerBet;
        uint256 loserBet;
        string winnerAddress;
        string loserAddress;
        bytes signature;
    }

    // Los jugadores transfieren tokens al contrato para jugar
    function transferirTokens(uint256 amount) external {
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Error en la transferencia"
        );
        balances[msg.sender] += amount;
        canPlay[msg.sender] = true;
        emit TransferTokens(msg.sender, amount);
    }

    /// @notice Redeems an WinnerVoucher for an actual reward.
    /// @param voucher A signed WinnerVoucher that describes the Reward to be redeemed.
    function redeem( WinnerVoucher calldata voucher
    ) public {
        // make sure signature is valid and get the address of the signer
        address signer = _verify(voucher);

        // make sure that the signer is authorized to mint NFTs
        require(
            hasRole(MINTER_ROLE, signer),
            "Signature invalid or unauthorized"
        );

        require(
            vouchers[voucher.voucherId] != true,
            "Voucher spent"
        );

        require(
            voucher.winnerBet + voucher.loserBet == voucher.winnerReward,
            "Voucher reward and bets do not match"
        );

        require(
            balances[stringToAddress(voucher.winnerAddress)] >= voucher.winnerBet && balances[stringToAddress(voucher.loserAddress)] >= voucher.loserBet, 
            "Balances and Bets not matching" 
        );

        vouchers[voucher.voucherId] = true;

        balances[stringToAddress(voucher.winnerAddress)] -= voucher.winnerBet;
        balances[stringToAddress(voucher.loserAddress)] -= voucher.loserBet;
        if(balances[stringToAddress(voucher.loserAddress)] == 0) {
            canPlay[stringToAddress(voucher.loserAddress)] = false;
        }
        if(balances[stringToAddress(voucher.winnerAddress)] == 0){
        canPlay[stringToAddress(voucher.winnerAddress)] = false;
        }

        // TODO partition the Reward to cover FIF fee
        uint256 _amountOfFIFCoinForAuthor       = (( 2128623629 * 10**9) * voucher.winnerReward) / 10**20; //  2.128623629 % BMMM3SC Author
        uint256 _amountOfFIFCoinForTreasury     = (( 2461179748 * 10**9) * voucher.winnerReward) / 10**20; //  2.461179748 % BMMM3SC Treasury
        uint256 _amountOfFIFCoinForWinner       = ((91803398874 * 10**9) * voucher.winnerReward) / 10**20; // 91.803398874 % BMMM3SC Sender
        uint256 _amountOfFIFCoinForDAO          = (( 3606797749 * 10**9) * voucher.winnerReward) / 10**20; //  3.606797749 % BMMM3SC DAO

        token.approve(authorAddress, _amountOfFIFCoinForAuthor);
        token.transfer(authorAddress, _amountOfFIFCoinForAuthor);

        token.approve(treasuryAddress, _amountOfFIFCoinForTreasury);
        token.transfer(treasuryAddress, _amountOfFIFCoinForTreasury);

        token.approve(DAOAddress, _amountOfFIFCoinForDAO);
        token.transfer(DAOAddress, _amountOfFIFCoinForDAO);

        token.approve(stringToAddress(voucher.winnerAddress), _amountOfFIFCoinForWinner);
        token.transfer(address(stringToAddress(voucher.winnerAddress)), _amountOfFIFCoinForWinner);
        emit RewardRedeemed(stringToAddress(voucher.winnerAddress), _amountOfFIFCoinForWinner);
    }

     function stringToAddress(string calldata s) public pure  returns (address) {
        bytes memory _bytes = hexStringToAddress(s);
        require(_bytes.length >= 1 + 20, "toAddress_outOfBounds");
        address tempAddress;

        assembly {
            tempAddress := div(mload(add(add(_bytes, 0x20), 1)), 0x1000000000000000000000000)
        }

        return tempAddress;
    }
     function hexStringToAddress(string calldata s) public pure  returns (bytes memory) {
        bytes memory ss = bytes(s);
        require(ss.length%2 == 0); // length must be even
        bytes memory r = new bytes(ss.length/2);
        for (uint i=0; i<ss.length/2; ++i) {
            r[i] = bytes1(fromHexChar(uint8(ss[2*i])) * 16 +
                        fromHexChar(uint8(ss[2*i+1])));
        }

        return r;

    }

     function fromHexChar(uint8 c) public pure returns (uint8) {
        if (bytes1(c) >= bytes1('0') && bytes1(c) <= bytes1('9')) {
            return c - uint8(bytes1('0'));
        }
        if (bytes1(c) >= bytes1('a') && bytes1(c) <= bytes1('f')) {
            return 10 + c - uint8(bytes1('a'));
        }
        if (bytes1(c) >= bytes1('A') && bytes1(c) <= bytes1('F')) {
            return 10 + c - uint8(bytes1('A'));
        }
        return 0;
    }

    /// @notice Returns a hash of the given WinnerVoucher, prepared using EIP712 typed data hashing rules.
    /// @param voucher An WinnerVoucher to hash.
    function _hash(
        WinnerVoucher calldata voucher
    ) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "WinnerVoucher(uint256 voucherId,uint256 winnerReward,uint256 winnerBet,uint256 loserBet,string winnerAddress,string loserAddress)"
                        ),
                        voucher.voucherId,
                        voucher.winnerReward,
                        voucher.winnerBet,
                        voucher.loserBet,
                        keccak256(bytes(voucher.winnerAddress)),
                        keccak256(bytes(voucher.loserAddress))
                    )
                )
            );
    }

    /// @notice Returns the chain id of the current blockchain.
    /// @dev This is used to workaround an issue with ganache returning different values from the on-chain chainid() function and
    ///  the eth_chainId RPC method. See https://github.com/protocol/nft-website/issues/121 for context.
    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    /// @notice Verifies the signature for a given WinnerVoucher, returning the address of the signer.
    /// @dev Will revert if the signature is invalid. Does not verify that the signer is authorized to mint NFTs.
    /// @param voucher An WinnerVoucher describing an unminted NFT.
    function _verify(
        WinnerVoucher calldata voucher
    ) internal view returns (address) {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, voucher.signature);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(AccessControl)
        returns (bool)
    {

    return AccessControl.supportsInterface(interfaceId);

    }
}