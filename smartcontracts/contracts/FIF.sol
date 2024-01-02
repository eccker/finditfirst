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

// pragma solidity ^0.8.20;
// pragma abicoder v2; // required to accept structs as function parameters

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

// contract Juego is Ownable, ERC721URIStorage, EIP712, AccessControl {
//     IERC20 public token; // Token ERC-20 utilizado en el juego

//     mapping(address => uint256) public balances; // Saldo de tokens de cada jugador
//     mapping(address => bool) public hasVoucher; // Indica si un jugador tiene un voucher
//     mapping(address => bool) public canPlay; // Indica si un jugador puede jugar porque ya pagó

//     event TransferTokens(address indexed player, uint256 amount);
//     // event GanarJuego(address indexed player, uint256 reward);
//     event CanjearVoucher(address indexed player, uint256 reward);

//     constructor(address _tokenAddress) {
//         token = IERC20(_tokenAddress);
//     }

//     // Los jugadores transfieren tokens al contrato para jugar
//     function transferirTokens(uint256 amount) external {
//         require(token.transferFrom(msg.sender, address(this), amount), "Error en la transferencia");
//         balances[msg.sender] += amount;
//         canPlay[msg.sender] = true;
//         emit TransferTokens(msg.sender, amount);
//     }

//     // // El host del juego otorga un voucher al jugador ganador
//     // function ganarJuego(address player, uint256 rewardAmount) external onlyOwner {
//     //     require(balances[player] > 0, "El jugador no tiene suficientes tokens para jugar");

//     //     balances[player] = 0; // Se retiran los tokens del jugador
//     //     hasVoucher[player] = true;

//     //     // Puedes implementar la lógica para otorgar la recompensa aquí
//     //     // (por ejemplo, transferir tokens adicionales al jugador)

//     //     emit GanarJuego(player, rewardAmount);
//     // }

//     // El jugador canjea su voucher por la recompensa
//     function canjearVoucher(bytes32 voucher) external {
//         require(hasVoucher[msg.sender], "El jugador no tiene un voucher");

//         // Puedes implementar la lógica para otorgar la recompensa aquí
//         // (por ejemplo, transferir la recompensa al jugador)

//         hasVoucher[msg.sender] = false;
//         canPlay[msg.sender] = false;

//         uint256 _amountOfBMMM3SCForAuthor       = (( 2128623629 * 10**9) * _amountOfBMMM3SCToMint) / 10**20; //  2.128623629 % BMMM3SC Author
//         uint256 _amountOfBMMM3SCForTreasury     = (( 2461179748 * 10**9) * _amountOfBMMM3SCToMint) / 10**20; //  2.461179748 % BMMM3SC Treasury
//         uint256 _amountOfBMMM3SCForSender       = ((91803398874 * 10**9) * _amountOfBMMM3SCToMint) / 10**20; // 91.803398874 % BMMM3SC Sender
//         uint256 _amountOfBMMM3SCForDAO          = (( 3606797749 * 10**9) * _amountOfBMMM3SCToMint) / 10**20; //  3.606797749 % BMMM3SC DAO

//         emit CanjearVoucher(msg.sender, /* rewardAmount */);
//     }

//     ////////
// function redeem(address redeemer, NFTVoucher calldata voucher) public payable returns (uint256) {
//     // make sure signature is valid and get the address of the signer
//     address signer = _verify(voucher);

//     // make sure that the signer is authorized to mint NFTs
//     require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");

//     // make sure that the redeemer is paying enough to cover the buyer's cost
//     require(msg.value >= voucher.minPrice, "Insufficient funds to redeem");

//     // first assign the token to the signer, to establish provenance on-chain
//     _mint(signer, voucher.tokenId);
//     _setTokenURI(voucher.tokenId, voucher.uri);

//     // transfer the token to the redeemer
//     _transfer(signer, redeemer, voucher.tokenId);

//     // record payment to signer's withdrawal balance
//     pendingWithdrawals[signer] += msg.value;

//     return voucher.tokenId;
//   }
// ////////
// }
