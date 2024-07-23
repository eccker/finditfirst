const { expect } = require("chai")
const { VoucherMaker } = require('../lib')
const { ethers } = require("hardhat")

var path = require('path')
const TAG = path.basename(__filename) + `:`
const re_getFileLine = /(?<=\/)[^\/]+\:\d+\:\d+/
const DEBUG = true

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
        DEBUG?console.log(`\r\nowner address: ${owner.address},\r\np1    address: ${player1.address}, \r\np2    address: ${player2.address}`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        usdTokenTest = await ethers.deployContract("USDTokenTest");
        DEBUG?console.log(`USD Token Test deployed at addres: ${usdTokenTest.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        fifToken = await ethers.deployContract("FIFToken", [owner.address, owner.address, owner.address, usdTokenTest.target, ethers.parseEther('0.1')]);
        DEBUG?console.log(`FIF Token      deployed at address: ${fifToken.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        fif = await ethers.deployContract("FIFGAME", [], owner);
        DEBUG?console.log(`FIF Game       deployed at address: ${fif.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        fifTicket = await ethers.deployContract("FIFTicket", [owner.address, owner.address, fif.target]);
        DEBUG?console.log(`FIF Ticket     deployed at address: ${fifTicket.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        await fif.connect(owner).setTokenAndTicketAddress(fifToken.target, fifTicket.target)

        await usdTokenTest.connect(owner).transfer(player1.address, ethers.parseEther('1'))
        await usdTokenTest.connect(owner).transfer(player2.address, ethers.parseEther('1'))
        DEBUG?console.log(`USDTT transfer from owner to P1 (balance: ${await usdTokenTest.balanceOf(player1.address)}) and P2 (  balance: ${await usdTokenTest.balanceOf(player2.address)})`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        await usdTokenTest.connect(player1).approve(fifToken.target, ethers.parseEther('1'))
        await usdTokenTest.connect(player2).approve(fifToken.target, ethers.parseEther('1'))
        DEBUG?console.log(`USDTT approved from P1        (allowance: ${await usdTokenTest.allowance(player1.address, fifToken.target)}) and P2 (allowance: ${await usdTokenTest.allowance(player2.address, fifToken.target)}) to FIF Token`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        await fifToken.connect(player1).mint(player1.address, ethers.parseEther('1'));
        await fifToken.connect(player2).mint(player2.address, ethers.parseEther('1'));
        DEBUG?console.log(`FIF Token minted by P1          (balance: ${await fifToken.balanceOf(player1.address)}) and P2 (  balance: ${await fifToken.balanceOf(player2.address)}) to FIF Token`, `at ${(new Error().stack).match(re_getFileLine)}`):null


        await fifToken.connect(player1).approve(fif.target, ethers.parseEther('1'))
        await fifToken.connect(player2).approve(fif.target, ethers.parseEther('1'))
        DEBUG?console.log(`FIF Token approved from P1    (allowance: ${await fifToken.allowance(player1.address, fif.target)}) and P2 (allowance: ${await fifToken.allowance(player2.address, fif.target)}) to FIF Token`, `at ${(new Error().stack).match(re_getFileLine)}`):null

   
        // FIFGAME contract is the only one who can mint tickets to players
        await fif.connect(player1).mintTickets(ethers.parseEther('1'))
        await fif.connect(player2).mintTickets(ethers.parseEther('1'))
        DEBUG?console.log(`FIF Tickets minted by P1        (balance: ${await fifTicket.balanceOf(player1.address)}) and P2 (  balance: ${await fifTicket.balanceOf(player2.address)}) to FIF Token`, `at ${(new Error().stack).match(re_getFileLine)}`):null
      

        // TODO make use of permit functionality to avoid approve gas consupmtion 
        await fifTicket.connect(player1).approve(fif.target, ethers.parseEther('1'))
        await fifTicket.connect(player2).approve(fif.target, ethers.parseEther('1'))
        DEBUG?console.log(`FIF Tickets approved by P1    (allowance: ${await fifTicket.allowance(player1.address, fif.target)}) and P2 (allowance: ${await fifTicket.allowance(player2.address, fif.target)}) to FIF GAME`, `at ${(new Error().stack).match(re_getFileLine)}`):null

      
        await fif.connect(player1).startGameMatch(ethers.parseEther('1'))
        await fif.connect(player2).startGameMatch(ethers.parseEther('1'))
        DEBUG?console.log(`FIF Tickets balance by P1 (balance: ${await fifTicket.balanceOf(player1.address)}) and P2 (balance: ${await fifTicket.balanceOf(player2.address)}) after spent tickets on FIF GAME`, `at ${(new Error().stack).match(re_getFileLine)}`):null

    
    });

    it("It should redeem a voucher", async () => {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = ethers.parseEther('2'), 
        winnerBet = ethers.parseEther('1'), 
        winnerAddress =  `${player1.address}`
 
        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, winnerAddress)
        DEBUG?console.log("point 5"):null
        
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

    // it("Should fail to redeem a Reward with mismatch bets and reward", async function () {
    //     const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
    //     let voucherID = 1,
    //     winnerReward = 32, 
    //     winnerBet = 15, 
    //     winnerAddress =  `${player1.address}`

    //     const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, winnerAddress)

    //     await expect(fif.redeem(voucher))
    //         // .to.be.revertedWith('Voucher reward and bets do not match')
    // });


    
    // it("Should fail to redeem a Reward with mismatch Balances and Bets not matching", async function () {
    //     const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
    //     let voucherID = 1,
    //     winnerReward = ethers.parseEther('40'), 
    //     winnerBet = ethers.parseEther('20'), 
    //     winnerAddress =  `${player1.address}`
    //     const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, winnerAddress)
        
    //     await expect(fif.redeem(voucher))
    // });

});