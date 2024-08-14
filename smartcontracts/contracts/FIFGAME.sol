//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;
pragma abicoder v2; // required to accept structs as function parameters

import "hardhat/console.sol";
bool constant DEBUG = true;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

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

contract FIFGameHS is EIP712, AccessControl,  VRFConsumerBaseV2Plus {
    uint256 private s_subscriptionId;
    bytes32 s_keyHash = 0x816bedba8a50b294e5cbd47842baf240c2385f2eaf719edbd4f250a137a8c899;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOMAIN = "FIND-IT-FIRST";
    string private constant SIGNATURE_VERSION = "1";

    IERC20 public fifToken; // Standard ERC-20 Token
    IFIFTicket public fifTicket; // Internal ERC-20 Token (Ticket)

    mapping(uint256 => bool) public vouchers; // Indica si un jugador tiene un voucher
    mapping(uint256 => address) private s_players;
    // mapping(address => uint256) private s_results;
    mapping(address => uint256) private ticketBalances;
    
    uint32 constant CALLBACK_GAS_LIMIT = 100000;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint32 constant NUM_WORDS = 100;


    address public AUTHOR_ADDRESS = 0x090Ec11314d4BD31B536F52472d2E6A1D4771220;
    address public DAO_TREASURY_ADDRESS = 0x88c7CE98b4924c7eA58F160D3A128e0592ECB053;
    address public DAO_FUND_ADDRESS = 0x2696b670D795e3B524880402C67b1ACCe6C1860f;
    address public DEVELOPER_ADDRESS = 0x2696b670D795e3B524880402C67b1ACCe6C1860f;
    address public CONTENT_CREATORS_ADDRESS = 0x2696b670D795e3B524880402C67b1ACCe6C1860f;
    uint256 public TOKEN_TO_TICKET_RATE = 1 ether;
    
    uint256[] public s_randomWords;
    // uint256 public s_requestId;
    uint256 public highScorePool = 0;

    struct Voucher {
        uint256 voucherId;
        uint256 amountToWithdraw;
        // uint256 winnerBet;
        string recipientAddress;
        bytes signature;
    }

    event GameMatchRequested(address indexed player, uint256 betAmount, uint256 indexed requestId, uint256 indexed currentHSPoolAmount);
    event GameMatchStarted(address indexed player, uint256 indexed requestId, uint256 randomNumbers);
    event RewardRedeemed(address indexed player, uint256 amount);

    constructor(uint256 _subscriptionId, address _vrfCoordinator) VRFConsumerBaseV2Plus(_vrfCoordinator) EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        s_subscriptionId = _subscriptionId;
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function setTokenAndTicketAddress(address _FIFTokenAddress, address _FIFTicketAddress) external onlyRole(MINTER_ROLE) {
        fifToken = IERC20(_FIFTokenAddress);
        fifTicket = IFIFTicket(_FIFTicketAddress);
    }

    function setTokenToTicketRate(uint256 rate) external onlyRole(MINTER_ROLE) {
        TOKEN_TO_TICKET_RATE = rate;
    }

    function mintTickets(
        uint256 amount,
        uint256 deadline,
        bytes32 r,
        bytes32 s,
        uint8 v
    )external 
    {
        require(
            amount % TOKEN_TO_TICKET_RATE == 0,
            "Must send a multiple of the T2TR"
        );

    (bool success, ) = address(fifToken).call(
        abi.encodeWithSignature(
            "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        )
    );

    require(success, "Error in permit");

    require(
            fifToken.transferFrom(
                msg.sender,
                address(this),
                amount
            ),
            "Token transfer failed"
        );

        // Ensure tickets are non-transferable and can only be managed by FIFGameHS
        // mint it to this smart contract address 
        fifTicket.mint(address(this), amount);

        // associate msg.sender with amount 
        ticketBalances[msg.sender] += amount;

        DEBUG?console.log("SC ::: FIFTicket minted: mintTickets", msg.sender, amount): ();

    }

    function requestGameMatch(uint256 _ticketsToBet) external {
        DEBUG?console.log("SC ::: START: requestGameMatch", msg.sender):();
        require(
            _ticketsToBet % 1 ether == 0,
            "Must send a multiple of the T2TR"
        );

        require(
            ticketBalances[msg.sender] >= _ticketsToBet,
            "Not enough tickets to bet"
        );
        ticketBalances[msg.sender] -= _ticketsToBet;
        fifTicket.burn(_ticketsToBet);
        highScorePool += _ticketsToBet;

        // request a random number (chainlink)
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        s_players[requestId] = msg.sender;
        
        // event emit the sender, bet and requestId
        emit GameMatchRequested(msg.sender, _ticketsToBet, requestId, highScorePool);
        DEBUG?console.log("SC ::: END of requestGameMatch"):();
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        uint256 rn = _randomWords[0];
        emit GameMatchStarted(s_players[_requestId], _requestId, rn);
    }

    function redeem(Voucher calldata voucher) public {
        // make sure signature is valid and get the address of the signer
        address signer = _verify(voucher);

        // make sure that the signer is authorized to mint NFTs
        require(
            hasRole(MINTER_ROLE, signer),
            "Signature invalid or unauthorized"
        );

        require(vouchers[voucher.voucherId] != true, "Voucher spent");

        vouchers[voucher.voucherId] = true;
        DEBUG?console.log("SC ::: redeem", msg.sender, highScorePool): ();
        DEBUG?console.log("SC ::: redeem", msg.sender, voucher.amountToWithdraw): ();
        require(highScorePool >= voucher.amountToWithdraw, "not enough in pool");
        highScorePool -= voucher.amountToWithdraw;
      
        uint256 _amountOfFIFCoinForWinner          = (81390000000 * voucher.amountToWithdraw) / 100000000000;
        uint256 _amountOfFIFCoinForAuthor          = ( 1618000000 * voucher.amountToWithdraw) / 100000000000;
        uint256 _amountOfFIFCoinForDAO             = ( 4854000000 * voucher.amountToWithdraw) / 100000000000;
        uint256 _amountOfFIFCoinForTreasury        = ( 6472000000 * voucher.amountToWithdraw) / 100000000000;
        uint256 _amountOfFIFCoinForDevelopers      = ( 3236000000 * voucher.amountToWithdraw) / 100000000000;
        uint256 _amountOfFIFCoinForContentCreators = ( 2430000000 * voucher.amountToWithdraw) / 100000000000;

        fifToken.transfer(AUTHOR_ADDRESS,                                   _amountOfFIFCoinForAuthor);
        fifToken.transfer(DAO_TREASURY_ADDRESS,                             _amountOfFIFCoinForTreasury);
        fifToken.transfer(DAO_FUND_ADDRESS,                                 _amountOfFIFCoinForDAO);
        fifToken.transfer(DEVELOPER_ADDRESS,                                _amountOfFIFCoinForDevelopers);
        fifToken.transfer(CONTENT_CREATORS_ADDRESS,                         _amountOfFIFCoinForContentCreators);
        fifToken.transfer(address(stringToAddress(voucher.recipientAddress)),  _amountOfFIFCoinForWinner);

        emit RewardRedeemed(stringToAddress(voucher.recipientAddress), _amountOfFIFCoinForWinner);
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

    function _hash(Voucher calldata voucher) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "Voucher(uint256 voucherId,uint256 amountToWithdraw,string recipientAddress)"
                        ),
                        voucher.voucherId,
                        voucher.amountToWithdraw,
                        // voucher.winnerBet,
                        keccak256(bytes(voucher.recipientAddress))
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

    function _verify(Voucher calldata voucher) internal view returns (address) {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, voucher.signature);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
        return AccessControl.supportsInterface(interfaceId);
    }
}
