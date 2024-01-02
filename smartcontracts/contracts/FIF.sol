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
    string private constant SIGNING_DOMAIN = "FIND_IT_FIRST";
    string private constant SIGNATURE_VERSION = "1";

    IERC20 public token; // Token ERC-20 utilizado en el juego

    mapping(address => uint256) public balances; // Saldo de tokens de cada jugador
    mapping(uint256 => bool) public vouchers; // Indica si un jugador tiene un voucher
    mapping(address => bool) public canPlay; // Indica si un jugador puede jugar porque ya pagó

    // mapping(address => uint256) pendingWithdrawals;
    event TransferTokens(address indexed player, uint256 amount);

    constructor(
        address payable minter,
        address _tokenAddress
    ) EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        _grantRole(MINTER_ROLE, minter);
        token = IERC20(_tokenAddress);
    }

    /// @notice Represents winner's reward, which has not yet been recorded into the blockchain. A signed voucher can be redeemed for tokens using the redeem function.
    struct WinnerVoucher {
        uint256 voucherID;
        address winnerAddress;
        address loserAddress;
        uint256 winnerReward;
        uint256 winnerBet;
        uint256 loserBet;
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

    /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.
    /// @param voucher A signed NFTVoucher that describes the NFT to be redeemed.
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
            vouchers[voucher.voucherID] != true,
            "Voucher spent"
        );

        require(
            voucher.winnerBet + voucher.loserBet == voucher.winnerReward,
            "Voucher reward and bets do not match"
        );

        require(
            balances[voucher.winnerAddress] >= voucher.winnerBet && balances[voucher.loserAddress] >= voucher.winnerBet, 
            "Balances and Bets not matching" 
        );

        vouchers[voucher.voucherID] = true;

        balances[voucher.winnerAddress] -= voucher.winnerBet;
        balances[voucher.loserAddress] -= voucher.loserBet;
        if(balances[voucher.loserAddress] == 0) {
            canPlay[voucher.loserAddress] = false;
        }
        if(balances[voucher.winnerAddress] == 0){
        canPlay[voucher.winnerAddress] = false;
        }

        token.transferFrom(address(this), voucher.winnerAddress, voucher.winnerReward);
    }

    /// @notice Returns a hash of the given NFTVoucher, prepared using EIP712 typed data hashing rules.
    /// @param voucher An NFTVoucher to hash.
    function _hash(
        WinnerVoucher calldata voucher
    ) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "WinnerVoucher(uint256 voucherID, address winnerAddress, address loserAddress, uint256 winnerReward, uint256 winnerBet, uint256 loserBet;)"
                        ),
                        voucher.voucherID,
                        voucher.winnerAddress,
                        voucher.loserAddress,
                        voucher.winnerReward,
                        voucher.winnerBet,
                        voucher.loserBet
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

    /// @notice Verifies the signature for a given NFTVoucher, returning the address of the signer.
    /// @dev Will revert if the signature is invalid. Does not verify that the signer is authorized to mint NFTs.
    /// @param voucher An NFTVoucher describing an unminted NFT.
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
        return
            AccessControl.supportsInterface(interfaceId);
    }
}