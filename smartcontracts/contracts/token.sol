// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0; 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 
contract MyToken is ERC20 { 
    uint256 public constant tokenPrice = 1 ether; 
// Price for minting tokens 
address public owner; 
constructor(
    string memory _tokenName,
    string memory _tokenSymbol
) ERC20(_tokenName, _tokenSymbol) { 
    owner = msg.sender; 
} 

function buyTokens() external payable { 
    require(msg.value % tokenPrice == 0, "Must send a multiple of the token price"); 
    uint256 tokensToMint = msg.value / tokenPrice; 
    _mint(msg.sender, tokensToMint); 
} 

function sellTokens(uint256 tokenAmount) external { 
    require(balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance"); 
    uint256 ethAmount = (tokenPrice * tokenAmount * 91) / 100; 
    require(address(this).balance >= ethAmount, "Insufficient ETH in contract"); 
    _burn(msg.sender, tokenAmount); 
    payable(msg.sender).transfer(ethAmount);     
}

// Function to allow contract to receive ETH 
receive() external payable {} 

// Owner can withdraw ETH from the contract 
function withdrawETH() external { 
    require(msg.sender == owner, "Only the owner can withdraw ETH"); 
    payable(owner).transfer(address(this).balance); 
    } 
}