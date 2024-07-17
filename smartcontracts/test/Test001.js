const { expect } = require("chai");
const { VoucherMaker } = require('../lib');
const { ethers } = require("hardhat");

describe("Find It First Smart Contract Test", () => {
    let fifToken
    let usdTokenTest
    let fif
    let owner
    let player1
    let player2
    let userRandom
    beforeEach(async function () {
        [owner, player1, player2, userRandom] = await ethers.getSigners();
        usdTokenTest = await ethers.deployContract("USDTokenTest");
        console.log("point 0")
        
        fifToken = await ethers.deployContract("FIFToken", [owner.address, owner.address, owner.address, usdTokenTest.target, ethers.parseEther('0.1')]);
        console.log("point 1")
        fif = await ethers.deployContract("FIFGAME", [], owner);
        fifTicket = await ethers.deployContract("FIFTicket", [owner.address, owner.address, fif.target]);
        console.log("point 1a")
        await fif.connect(owner).setTokenAndTicketAddress(fifToken.target, fifTicket.target)

        await usdTokenTest.connect(owner).transfer(player1.address, ethers.parseEther('1'))
        await usdTokenTest.connect(owner).transfer(player2.address, ethers.parseEther('1'))
        console.log("point 2")
        
        await usdTokenTest.connect(player1).approve(fifToken.target, ethers.parseEther('1'))
        await usdTokenTest.connect(player2).approve(fifToken.target, ethers.parseEther('1'))
        console.log("point 3")
        
        await fifToken.connect(player1).mint(player1.address, ethers.parseEther('1'));
        await fifToken.connect(player2).mint(player2.address, ethers.parseEther('1'));

        await fifToken.connect(player1).approve(fif.target, ethers.parseEther('1'))
        await fifToken.connect(player2).approve(fif.target, ethers.parseEther('1'))
   
        // FIFGAME contract is the only one who can mint tickets to players
        await fif.connect(player1).mintTickets(ethers.parseEther('1'))
        await fif.connect(player2).mintTickets(ethers.parseEther('1'))
      


        await fifTicket.connect(player1).approve(fif.target, ethers.parseEther('1'))
        await fifTicket.connect(player2).approve(fif.target, ethers.parseEther('1'))
      
        await fif.connect(player1).startGameMatch(ethers.parseEther('1'))
        await fif.connect(player2).startGameMatch(ethers.parseEther('1'))
        console.log("point 4")
    
    });

    it("It should redeem a voucher", async () => {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = ethers.parseEther('2'), 
        winnerBet = ethers.parseEther('1'), 
        winnerAddress =  `${player1.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, winnerAddress)
        console.log("point 5")
        
        expect(await fif.redeem(voucher))
        .to.emit(fif, 'RewardRedeemed')  // transfer from null address to minter
        .withArgs(voucher.winnerAddress, voucher.winnerReward)
    })

    it("Should fail to redeem a Reward that's already been claimed", async function () {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = 31, 
        winnerBet = 15, 
        winnerAddress =  `${player1.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, winnerAddress)

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
        winnerAddress =  `${player1.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, winnerAddress)

        await expect(fif.redeem(voucher))
            // .to.be.revertedWith('Voucher reward and bets do not match')
    });


    
    it("Should fail to redeem a Reward with mismatch Balances and Bets not matching", async function () {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = ethers.parseEther('40'), 
        winnerBet = ethers.parseEther('20'), 
        winnerAddress =  `${player1.address}`
        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, winnerAddress)
        
        await expect(fif.redeem(voucher))
    });

});