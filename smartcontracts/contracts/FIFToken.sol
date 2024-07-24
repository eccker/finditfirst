// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

/// @custom:security-contact kcc_sec@sec.se
contract FIFToken is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    AccessControl,
    ERC20Permit,
    ERC20FlashMint
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    address public paymentTokenAddress;
    IERC20 public paymentToken;
    uint256 public paymentTokenReserve;

    address public authorAddress = 0x090Ec11314d4BD31B536F52472d2E6A1D4771220;
    address public treasuryAddress = 0x88c7CE98b4924c7eA58F160D3A128e0592ECB053;
    address public DAOAddress = 0x2696b670D795e3B524880402C67b1ACCe6C1860f;

    uint256 public minAmountToMint;

    constructor(
        address defaultAdmin,
        address pauser,
        address minter,
        address _paymentTokenAddress,
        uint256 _minAmountToMint
    ) ERC20("Find It First", "FIF") ERC20Permit("Find It First") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
        paymentTokenAddress = _paymentTokenAddress;
        paymentToken = IERC20(_paymentTokenAddress);
        minAmountToMint = _minAmountToMint;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function setTokenAddress(
        address _tokenAddress
    ) external onlyRole(MINTER_ROLE) {
        paymentTokenAddress = _tokenAddress;
        paymentToken = IERC20(_tokenAddress);
    }

    function setMinAmountToMint(uint256 amount) external onlyRole(MINTER_ROLE) {
        minAmountToMint = amount;
    }

    // user must approve "amount" to this contract before executing this function
    function mint(address to, uint256 amount) public {
        require(amount >= minAmountToMint,'Not Enough to Mint');

        require(
            paymentToken.transferFrom(msg.sender, address(this), amount),
            "Failed to transfer payment tokens"
        );

        // Perform the minting
        _mint(to, amount);

        paymentTokenReserve += amount;
    }

    function withdrawPaymentTokens(uint256 amount) public {
        require(
            transferFrom(msg.sender, address(this), amount),
            "Failed to transfer FIF tokens"
        );

        // partition withdraw to cover FIF fee
        uint256 _amountOfpaymentTokenForAuthor       = (( 2128623629 * 10**9) * amount) / 10**20; //  2.128623629 % Author
        uint256 _amountOfpaymentTokenForTreasury     = (( 2461179748 * 10**9) * amount) / 10**20; //  2.461179748 % Treasury
        uint256 _amountOfpaymentTokenForWithdrawer   = ((91803398874 * 10**9) * amount) / 10**20; // 91.803398874 % Sender
        uint256 _amountOfpaymentTokenForDAO          = (( 3606797749 * 10**9) * amount) / 10**20; //  3.606797749 % DAO


        require(
            paymentToken.transfer(authorAddress, _amountOfpaymentTokenForAuthor),
            "Failed to transfer payment tokens to Author"
        );
        require(
            paymentToken.transfer(treasuryAddress, _amountOfpaymentTokenForTreasury),
            "Failed to transfer payment tokens to Treasury"
        );
        require(
            paymentToken.transfer(DAOAddress, _amountOfpaymentTokenForDAO),
            "Failed to transfer payment tokens to DAO"
        );

        burn(amount);

        require(
            paymentToken.transfer(msg.sender, _amountOfpaymentTokenForWithdrawer),
            "Failed to transfer payment tokens to Withdrawer"
        );
    }

    //////////////////////////////

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
