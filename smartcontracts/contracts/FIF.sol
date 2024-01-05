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

contract FIF is ERC721URIStorage, EIP712, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOMAIN = "FIND-IT-FIRST";
    string private constant SIGNATURE_VERSION = "1";

    IERC20 public token; // Token ERC-20 utilizado en el juego

    mapping(address => uint256) public balances; // Saldo de tokens de cada jugador
    mapping(uint256 => bool) public vouchers; // Indica si un jugador tiene un voucher
    mapping(address => bool) public canPlay; // Indica si un jugador puede jugar porque ya pagó

    // mapping(address => uint256) pendingWithdrawals;
    event TransferTokens(address indexed player, uint256 amount);
    event RewardRedeemed(address indexed player, uint256 amount);

    constructor(
        address _tokenAddress
    ) ERC721("LazyNFT", "LAZ") EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
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

    /// @notice Redeems an WinnerVoucher for an actual NFT, creating it in the process.
    /// @param voucher A signed WinnerVoucher that describes the NFT to be redeemed.
    function redeem( WinnerVoucher calldata voucher
    ) public {
        // make sure signature is valid and get the address of the signer
        address signer = _verify(voucher);

        console.log('SC::::: Signer is:', signer);
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

        console.log('SC::::::FIF.sol before #Balances and Bets not matching#, voucher.winnerAddress', voucher.winnerAddress);
        console.log('SC::::::FIF.sol before #Balances and Bets not matching#, toAddress(voucher.winnerAddress)', toAddress(voucher.winnerAddress));
        console.log('SC::::::FIF.sol before #Balances and Bets not matching#, balances[toAddress(voucher.winnerAddress)]', balances[toAddress(voucher.winnerAddress)]);
        console.log('SC::::::FIF.sol before #Balances and Bets not matching#, voucher.winnerBet', voucher.winnerBet);
        console.log('SC::::::FIF.sol before #Balances and Bets not matching#, balances[toAddress(voucher.loserAddress)]', balances[toAddress(voucher.loserAddress)]);
        console.log('SC::::::FIF.sol before #Balances and Bets not matching#, voucher.loserBet', voucher.loserBet);

        require(
            balances[toAddress(voucher.winnerAddress)] >= voucher.winnerBet && balances[toAddress(voucher.loserAddress)] >= voucher.loserBet, 
            "Balances and Bets not matching" 
        );

        vouchers[voucher.voucherId] = true;

        balances[toAddress(voucher.winnerAddress)] -= voucher.winnerBet;
        balances[toAddress(voucher.loserAddress)] -= voucher.loserBet;
        if(balances[toAddress(voucher.loserAddress)] == 0) {
            canPlay[toAddress(voucher.loserAddress)] = false;
        }
        if(balances[toAddress(voucher.winnerAddress)] == 0){
        canPlay[toAddress(voucher.winnerAddress)] = false;
        }
        token.approve(toAddress(voucher.winnerAddress), voucher.winnerReward);
        token.transfer(address(toAddress(voucher.winnerAddress)), voucher.winnerReward);
        emit RewardRedeemed(toAddress(voucher.winnerAddress), voucher.winnerReward);
    }

     function toAddress(string calldata s) public  returns (address) {
        bytes memory _bytes = hexStringToAddress(s);
        require(_bytes.length >= 1 + 20, "toAddress_outOfBounds");
        address tempAddress;

        assembly {
            tempAddress := div(mload(add(add(_bytes, 0x20), 1)), 0x1000000000000000000000000)
        }

        return tempAddress;
    }
     function hexStringToAddress(string calldata s) public  returns (bytes memory) {
        bytes memory ss = bytes(s);
        require(ss.length%2 == 0); // length must be even
        bytes memory r = new bytes(ss.length/2);
        for (uint i=0; i<ss.length/2; ++i) {
            r[i] = bytes1(fromHexChar(uint8(ss[2*i])) * 16 +
                        fromHexChar(uint8(ss[2*i+1])));
        }

        return r;

    }

     function fromHexChar(uint8 c) public returns (uint8) {
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
        console.log("SC::::::getChainID is:",id);
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
        override(AccessControl, ERC721URIStorage)
        returns (bool)
    {

    return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);

    }
}