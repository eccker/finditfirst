// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @custom:security-contact kcc_sec@sec.se
contract USDTokenTest is ERC20 {
    constructor() ERC20("USD Token Test", "USDTTest") {
        _mint(msg.sender, 1000000000000 * 10 ** decimals());
    }
}
