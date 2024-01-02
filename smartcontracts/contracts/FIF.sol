// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Juego is Ownable {
    IERC20 public token; // Token ERC-20 utilizado en el juego

    mapping(address => uint256) public balances; // Saldo de tokens de cada jugador
    mapping(address => bool) public hasVoucher; // Indica si un jugador tiene un voucher
    mapping(address => bool) public canPlay; // Indica si un jugador puede jugar porque ya pagó

    event TransferTokens(address indexed player, uint256 amount);
    // event GanarJuego(address indexed player, uint256 reward);
    event CanjearVoucher(address indexed player, uint256 reward);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    // Los jugadores transfieren tokens al contrato para jugar
    function transferirTokens(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Error en la transferencia");
        balances[msg.sender] += amount;
        canPlay[msg.sender] = true;
        emit TransferTokens(msg.sender, amount);
    }

    // // El host del juego otorga un voucher al jugador ganador
    // function ganarJuego(address player, uint256 rewardAmount) external onlyOwner {
    //     require(balances[player] > 0, "El jugador no tiene suficientes tokens para jugar");
        
    //     balances[player] = 0; // Se retiran los tokens del jugador
    //     hasVoucher[player] = true;

    //     // Puedes implementar la lógica para otorgar la recompensa aquí
    //     // (por ejemplo, transferir tokens adicionales al jugador)
        
    //     emit GanarJuego(player, rewardAmount);
    // }

    // El jugador canjea su voucher por la recompensa
    function canjearVoucher() external {
        require(hasVoucher[msg.sender], "El jugador no tiene un voucher");

        // Puedes implementar la lógica para otorgar la recompensa aquí
        // (por ejemplo, transferir la recompensa al jugador)

        hasVoucher[msg.sender] = false;
        canPlay[msg.sender] = false;

        uint256 _amountOfBMMM3SCForAuthor       = (( 2128623629 * 10**9) * _amountOfBMMM3SCToMint) / 10**20; //  2.128623629 % BMMM3SC Author
        uint256 _amountOfBMMM3SCForTreasury     = (( 2461179748 * 10**9) * _amountOfBMMM3SCToMint) / 10**20; //  2.461179748 % BMMM3SC Treasury
        uint256 _amountOfBMMM3SCForSender       = ((91803398874 * 10**9) * _amountOfBMMM3SCToMint) / 10**20; // 91.803398874 % BMMM3SC Sender
        uint256 _amountOfBMMM3SCForDAO          = (( 3606797749 * 10**9) * _amountOfBMMM3SCToMint) / 10**20; //  3.606797749 % BMMM3SC DAO



        emit CanjearVoucher(msg.sender, /* rewardAmount */);
    }
}
