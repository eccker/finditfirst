const { expect } = require("chai");
const { VoucherMaker } = require('../lib');
const { ethers } = require("hardhat");

describe("Find It First Smart Contract Test", () => {
    let findItFirstToken
    let usdTokenTest
    let fif
    let owner
    let player1
    let player2
    let userRandom
    beforeEach(async function () {
        [owner, player1, player2, userRandom] = await ethers.getSigners();
        usdTokenTest = await ethers.deployContract("USDTokenTest");
        
        findItFirstToken = await ethers.deployContract("FindItFirstToken", [owner.address, owner.address, owner.address, usdTokenTest.target, ethers.parseEther('0.1')]);

        fif = await ethers.deployContract("FIFGAME", [findItFirstToken.target], owner);

        await usdTokenTest.connect(owner).transfer(player1.address, ethers.parseEther('1'))
        await usdTokenTest.connect(owner).transfer(player2.address, ethers.parseEther('1'))
        
        await usdTokenTest.connect(player1).approve(findItFirstToken.target, ethers.parseEther('1'))
        await usdTokenTest.connect(player2).approve(findItFirstToken.target, ethers.parseEther('1'))
        
        await findItFirstToken.connect(player1).mint(player1.address, ethers.parseEther('1'));
        await findItFirstToken.connect(player2).mint(player2.address, ethers.parseEther('1'));

        await findItFirstToken.connect(player1).approve(fif.target, ethers.parseEther('1'))
        await findItFirstToken.connect(player2).approve(fif.target, ethers.parseEther('1'))
      
        await fif.connect(player1).transferirTokens(ethers.parseEther('1'))
        await fif.connect(player2).transferirTokens(ethers.parseEther('1'))
    
    });

    it("It should redeem a voucher", async () => {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = ethers.parseEther('2'), 
        winnerBet = ethers.parseEther('1'), 
        loserBet = ethers.parseEther('1'),
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
        winnerReward = 31, 
        winnerBet = 15, 
        loserBet = 16,
        winnerAddress =  `${player1.address}`, 
        loserAddress = `${player2.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, loserBet, winnerAddress, loserAddress)

        await expect(await fif.redeem(voucher))
        .to.emit(fif, 'RewardRedeemed')  // transfer from null address to minter
        .withArgs(voucher.winnerAddress, Math.floor(voucher.winnerReward*.91803398874))

        await expect(fif.redeem(voucher))
            .to.be.revertedWith('Voucher spent')
    });

    it("Should fail to redeem a Reward with mismatch bets and reward", async function () {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = 32, 
        winnerBet = 15, 
        loserBet = 16,
        winnerAddress =  `${player1.address}`, 
        loserAddress = `${player2.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, loserBet, winnerAddress, loserAddress)

        await expect(fif.redeem(voucher))
            .to.be.revertedWith('Voucher reward and bets do not match')
    });


    
    it("Should fail to redeem a Reward with mismatch Balances and Bets not matching", async function () {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = ethers.parseEther('40'), 
        winnerBet = ethers.parseEther('20'), 
        loserBet = ethers.parseEther('20'),
        winnerAddress =  `${player1.address}`, 
        loserAddress = `${player2.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, loserBet, winnerAddress, loserAddress)
        
        await expect(fif.redeem(voucher))
        .to.be.revertedWith('Balances and Bets not matching')
    });

});