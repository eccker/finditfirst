const ethers = require('ethers')

// These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = "FIND-IT-FIRST"
const SIGNING_DOMAIN_VERSION = "1"

/**
 * JSDoc typedefs.
 * 
 * @typedef {object} WinnerVoucher
 * @property {ethers.BigNumber | number} tokenId the id of the un-minted NFT
 * @property {ethers.BigNumber | number} minPrice the minimum price (in wei) that the creator will accept to redeem this NFT
 * @property {string} uri the metadata URI to associate with this NFT
 * @property {ethers.BytesLike} signature an EIP-712 signature of all fields in the WinnerVoucher, apart from signature itself.
 */

/**
 * VoucherMaker is a helper class that creates WinnerVoucher objects and signs them, to be redeemed later by the LazyNFT contract.
 */
class VoucherMaker {

  /**
   * Create a new VoucherMaker targeting a deployed instance of the LazyNFT contract.
   * 
   * @param {Object} options
   * @param {ethers.Contract} contract an ethers Contract that's wired up to the deployed contract
   * @param {ethers.Signer} signer a Signer whose account is authorized to mint NFTs on the deployed contract
   */
  constructor({ contract, signer }) {
    this.contract = contract
    this.signer = signer
  }

  /**
   * Creates a new WinnerVoucher object and signs it using this VoucherMaker's signing key.
   * 
   * @param {ethers.BigNumber | number} tokenId the id of the un-minted NFT
   * @param {string} uri the metadata URI to associate with this NFT
   * @param {ethers.BigNumber | number} minPrice the minimum price (in wei) that the creator will accept to redeem this NFT. defaults to zero
   * 
   * @returns {WinnerVoucher}
   */
async createVoucher(voucherId, winnerReward, winnerBet, loserBet, winnerAddress, loserAddress) {
    const voucher = { voucherId, winnerReward, winnerBet, loserBet, winnerAddress, loserAddress }
    const domain = await this._signingDomain()
    const types = {
      WinnerVoucher: [
        {name: "voucherId", type: "uint256"},
        {name: "winnerReward", type: "uint256"},  
        {name: "winnerBet", type: "uint256"},  
        {name: "loserBet", type: "uint256"},  
        {name: "winnerAddress", type: "string"},
        {name: "loserAddress", type: "string"},  
      ]
    }
    const signature = await this.signer.signTypedData(domain, types, voucher)
    return {
      ...voucher,
      signature,
    }
  }

  /**
   * @private
   * @returns {object} the EIP-721 signing domain, tied to the chainId of the signer
   */
  async _signingDomain() {
    if (this._domain != null) {
      return this._domain
    }
    const chainId = await this.contract.getChainID()
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.target,
      chainId,
    }
    return this._domain
  }
}

module.exports = {
  VoucherMaker
}