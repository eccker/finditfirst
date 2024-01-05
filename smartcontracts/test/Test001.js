const { expect } = require("chai");
const { VoucherMaker } = require('../lib')

describe("Find It First Smart Contract Test", () => {
    let hardhatToken
    let fif
    let owner
    let player1
    let player2
    let userRandom
    beforeEach(async function () {
        [owner, player1, player2, userRandom] = await ethers.getSigners();
        hardhatToken = await ethers.deployContract("FindItFirstToken", [100]);
        
        fif = await ethers.deployContract("FIF", [hardhatToken.target], owner);
        await hardhatToken.connect(owner).mint(player1.address, 100);
        await hardhatToken.connect(owner).mint(player2.address, 100);

        await hardhatToken.connect(player1).approve(fif.target, 20)
        await hardhatToken.connect(player2).approve(fif.target, 20)

        await fif.connect(player1).transferirTokens(15)
        await fif.connect(player2).transferirTokens(16)
    });

    it("It should redeem a voucher", async () => {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = 20, 
        winnerBet = 10, 
        loserBet = 10
        winnerAddress =  `${player1.address}`, 
        loserAddress = `${player2.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, loserBet, winnerAddress, loserAddress)
        
        expect(await fif.redeem(voucher))
        .to.emit(fif, 'RewardRedeemed')  // transfer from null address to minter
        .withArgs(voucher.winnerAddress, voucher.winnerReward)
    
    })

    it("Should fail to redeem a Reward that's already been claimed", async function () {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = 20, 
        winnerBet = 10, 
        loserBet = 10
        winnerAddress =  `${player1.address}`, 
        loserAddress = `${player2.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, loserBet, winnerAddress, loserAddress)

        await expect(await fif.redeem(voucher))
        .to.emit(fif, 'RewardRedeemed')  // transfer from null address to minter
        .withArgs(voucher.winnerAddress, voucher.winnerReward)

        await expect(fif.redeem(voucher))
            .to.be.revertedWith('Voucher spent')
    });
});