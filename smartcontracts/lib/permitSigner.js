const ethers = require("ethers");

class ERC20PermitSigner {
  async sign(
    ownerAddress,
    spenderAddress,
    value,
    deadline,
    chainId,
    privateKey
  ) {
    const domain = {
      name: "FIFToken",
      version: "1",
      chainId: chainId,
      verifyingContract: ownerAddress,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "v", type: "uint8" },
        { name: "r", type: "bytes32" },
        { name: "s", type: "bytes32" },
      ],
    };

    const message = {
      owner: ownerAddress,
      spender: spenderAddress,
      value: value,
      deadline: deadline,
    };

    const signature = await ethers.Signer.prototype._signTypedData(
      domain,
      types,
      message,
      privateKey
    );

    const { v, r, s } = ethers.utils.splitSignature(signature);

    return { v, r, s };
  }
}

module.exports = ERC20PermitSigner;