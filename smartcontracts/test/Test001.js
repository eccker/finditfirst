const { expect } = require("chai")
const { VoucherMaker } = require('../lib')
const { ethers } = require("hardhat")

require("dotenv").config();

var path = require('path')
const TAG = path.basename(__filename) + `:`
const re_getFileLine = /(?<=\/)[^\/]+\:\d+\:\d+/
const DEBUG = true
const subscription_id = hre.ethers.parseUnits(process.env.SUBSCRIPTION_ID, 0);

describe("Find It First Smart Contract Test", () => {
    const AMOUNT_OF_TICKETS_TO_BUY = ethers.parseEther('150')
    const AMOUNT_TO_BET = ethers.parseEther('50')
    let fifToken
    let usdTokenTest
    let fif
    let owner
    let player1
    let player2
    let userRandom
    let fifVRFCoordinatorV2_5Mock
    let fifTokenPlayer1InitialBalance
    let fifTokenPlayer2InitialBalance

    beforeEach(async function () {
        [owner, player1, player2, userRandom] = await ethers.getSigners();
        DEBUG?console.log(`\r\nowner address: ${owner.address},\r\np1    address: ${player1.address}, \r\np2    address: ${player2.address}`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        usdTokenTest = await ethers.deployContract("USDTokenTest");
        DEBUG?console.log(`USD Token Test deployed at addres: ${usdTokenTest.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        fifToken = await ethers.deployContract("FIFToken", [owner.address, owner.address, owner.address, usdTokenTest.target, ethers.parseEther('0.1')]);
        DEBUG?console.log(`FIF Token      deployed at address: ${fifToken.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        fifVRFCoordinatorV2_5Mock = await ethers.deployContract("VRFCoordinatorV2_5Mock",[ethers.parseUnits("100000000000000000", 0), ethers.parseUnits("1000000000", 0), ethers.parseUnits("4045497107641754", 0)])
        DEBUG?console.log(`fifVRFCoordinatorV2_5Mock deployed at address: ${fifVRFCoordinatorV2_5Mock.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        await fifVRFCoordinatorV2_5Mock.createSubscription()
        filter = fifVRFCoordinatorV2_5Mock.filters.SubscriptionCreated
        events = await fifVRFCoordinatorV2_5Mock.queryFilter(filter, 1)
        const subId = events[0].args[0];
        
        await fifVRFCoordinatorV2_5Mock.fundSubscription(subId, ethers.parseEther('100'))
        DEBUG?console.log(`fundSubscription completed`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        fif = await ethers.deployContract("FIFGameHS", [subId, fifVRFCoordinatorV2_5Mock.target], owner);
        DEBUG?console.log(`FIF Game       deployed at address: ${fif.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        await fifVRFCoordinatorV2_5Mock.addConsumer(subId, fif.target)

        fifTicket = await ethers.deployContract("FIFTicket", [owner.address, owner.address, fif.target]);
        DEBUG?console.log(`FIF Ticket     deployed at address: ${fifTicket.target}`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        await fif.connect(owner).setTokenAndTicketAddress(fifToken.target, fifTicket.target)

        await usdTokenTest.connect(owner).transfer(player1.address, ethers.parseEther('1000'))
        await usdTokenTest.connect(owner).transfer(player2.address, ethers.parseEther('1000'))
        DEBUG?console.log(`USDTT transfer from owner to P1 (balance: ${await usdTokenTest.balanceOf(player1.address)}) and P2 (  balance: ${await usdTokenTest.balanceOf(player2.address)})`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        await usdTokenTest.connect(player1).approve(fifToken.target, ethers.parseEther('365'))
        await usdTokenTest.connect(player2).approve(fifToken.target, ethers.parseEther('200'))
        DEBUG?console.log(`USDTT approved from P1        (allowance: ${await usdTokenTest.allowance(player1.address, fifToken.target)}) and P2 (allowance: ${await usdTokenTest.allowance(player2.address, fifToken.target)}) to FIF Token`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        
        await fifToken.connect(player1).mint(player1.address, ethers.parseEther('365'));
        await fifToken.connect(player2).mint(player2.address, ethers.parseEther('200'));
        fifTokenPlayer1InitialBalance = await fifToken.balanceOf(player1.address)
        fifTokenPlayer2InitialBalance = await fifToken.balanceOf(player2.address)
        DEBUG?console.log(`FIF Token minted by P1          (balance: ${await fifToken.balanceOf(player1.address)}) and P2 (  balance: ${await fifToken.balanceOf(player2.address)}) to FIF Token`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        // Generate a random deadline for the permit
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    
        const { v, r, s } = await getPermitSignature(
            player1,
            fifToken,
            fif.target,
            AMOUNT_OF_TICKETS_TO_BUY,
            deadline
        );

        const { v: v2, r: r2, s: s2 } = await getPermitSignature(
            player2,
            fifToken,
            fif.target,
            AMOUNT_OF_TICKETS_TO_BUY,
            deadline
        );

        DEBUG?console.log(`FIF Token signature v, r, s returned`, `at ${(new Error().stack).match(re_getFileLine)}`):null
        // Call the mintTickets function with the permit signature
        await fif.connect(player1).mintTickets(
        AMOUNT_OF_TICKETS_TO_BUY,
        deadline,
        r,
        s,
        v
        );

        await fif.connect(player2).mintTickets(
            AMOUNT_OF_TICKETS_TO_BUY,
            deadline,
            r2,
            s2,
            v2
        );
    });

    it("It should redeem a voucher", async () => {
        // use of permit functionality to avoid approve gas consupmtion 
        expect(await fif.connect(player1).requestGameMatch(AMOUNT_TO_BET)).to.emit(fif,'GameMatchRequested').withArgs(player1.address,AMOUNT_TO_BET,1,AMOUNT_TO_BET)
        expect(await fif.connect(player2).requestGameMatch(AMOUNT_TO_BET)).to.emit(fif,'GameMatchRequested').withArgs(player2.address,AMOUNT_TO_BET,2,BigInt(AMOUNT_TO_BET)*BigInt(2n))
        DEBUG?console.log(`FIF requestGameMatch`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        filter = fif.filters.GameMatchRequested
        events = await fif.queryFilter(filter, 2)
        const eventP1 = events[0].args
        const eventP2 = events[1].args
        console.log(eventP1)
        console.log(eventP2)
 
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        amountToWithdraw = BigInt(AMOUNT_TO_BET)*BigInt(2), 
        // winnerBet = AMOUNT_TO_BET, 
        winnerAddress =  `${player1.address}`
        const voucher = await voucherMaker.createVoucher(voucherID, amountToWithdraw, winnerAddress)
        DEBUG?console.log("point 5"):null
        
        expect(await fif.connect(userRandom).redeem(voucher))
        .to.emit(fif, 'RewardRedeemed') 
        .withArgs(voucher.winnerAddress, voucher.amountToWithdraw)
        DEBUG?console.log("point 6: ", voucher.amountToWithdraw):null
        
        const expectedBalanceP1 = BigInt(fifTokenPlayer1InitialBalance) 
                                - AMOUNT_OF_TICKETS_TO_BUY
                                + (BigInt(voucher.amountToWithdraw) * BigInt(81390000000)) / BigInt(100000000000);
        DEBUG?console.log("point 7: ", expectedBalanceP1):null
        DEBUG?console.log("point 8: ", await fifToken.balanceOf(player1.address)):null

        const expectedBalanceP2 = fifTokenPlayer2InitialBalance - AMOUNT_OF_TICKETS_TO_BUY;

        let expectedBalanceAuthor           = (BigInt(voucher.amountToWithdraw) * BigInt(1618000000)) / BigInt(100000000000)
        let expectedBalanceContentCreators  = (BigInt(voucher.amountToWithdraw) * BigInt(2430000000)) / BigInt(100000000000)
        let expectedBalanceDevelopers       = (BigInt(voucher.amountToWithdraw) * BigInt(3236000000)) / BigInt(100000000000)
        let expectedBalanceDAO              = (BigInt(voucher.amountToWithdraw) * BigInt(4854000000)) / BigInt(100000000000)
        let expectedBalanceTreasury         = (BigInt(voucher.amountToWithdraw) * BigInt(6472000000)) / BigInt(100000000000)
        
        const AUTHOR_ADDRESS            = "0x090Ec11314d4BD31B536F52472d2E6A1D4771220";
        const DAO_TREASURY_ADDRESS      = "0x88c7CE98b4924c7eA58F160D3A128e0592ECB053";

        const DAO_FUND_ADDRESS          = "0x2696b670D795e3B524880402C67b1ACCe6C1860f";
        const DEVELOPER_ADDRESS         = "0x2696b670D795e3B524880402C67b1ACCe6C1860f";
        const CONTENT_CREATORS_ADDRESS  = "0x2696b670D795e3B524880402C67b1ACCe6C1860f";

        expect(await fifToken.balanceOf(player1.address))         .to.equal(expectedBalanceP1);
        expect(await fifToken.balanceOf(player2.address))         .to.equal(expectedBalanceP2);
        expect(await fifToken.balanceOf(AUTHOR_ADDRESS))          .to.equal(expectedBalanceAuthor);
        expect(await fifToken.balanceOf(DAO_TREASURY_ADDRESS))    .to.equal(expectedBalanceTreasury);
        expect(await fifToken.balanceOf(DAO_FUND_ADDRESS))        .to.equal(expectedBalanceDAO + expectedBalanceDevelopers + expectedBalanceContentCreators);
        expect(await fifToken.balanceOf(DEVELOPER_ADDRESS))       .to.equal(expectedBalanceDAO + expectedBalanceDevelopers + expectedBalanceContentCreators);
        expect(await fifToken.balanceOf(CONTENT_CREATORS_ADDRESS)).to.equal(expectedBalanceDAO + expectedBalanceDevelopers + expectedBalanceContentCreators);
    })

    it("Should fail to redeem a Reward that's already been claimed", async function () {
        
        await fif.connect(player1).requestGameMatch(ethers.parseEther('1'))
        await fif.connect(player2).requestGameMatch(ethers.parseEther('100'))
        DEBUG?console.log(`FIF Tickets balance by P1 (balance: ${await fifTicket.balanceOf(player1.address)}) and P2 (balance: ${await fifTicket.balanceOf(player2.address)}) after spent tickets on FIF GAME`, `at ${(new Error().stack).match(re_getFileLine)}`):null

        filter = fif.filters.GameMatchRequested
        events = await fif.queryFilter(filter, 2)

        const eventP1 = events[0].args
        const eventP2 = events[1].args

        console.log(eventP1)
        console.log(eventP2)
        
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        amountToWithdraw = 31, 
        winnerBet = 15, 
        recipientAddress =  `${player1.address}`

        const voucher = await voucherMaker.createVoucher(voucherID, amountToWithdraw, recipientAddress)

        await expect(await fif.redeem(voucher))
        .to.emit(fif, 'RewardRedeemed')  // transfer from null address to minter
        .withArgs(voucher.recipientAddress, Math.floor(voucher.amountToWithdraw*.81390000000))

        await expect(fif.redeem(voucher))
            .to.be.revertedWith('Voucher spent')
    });
});

// Helper function to generate permit signature
async function getPermitSignature(signer, token, spender, value, deadline) {
    const [nonce, name, version, chainId] = await Promise.all([
      token.nonces(signer.address),
      token.name(),
      "1",
      signer.provider.getNetwork().then((n) => n.chainId),
    ]);
  
    return ethers.Signature.from(
      await signer.signTypedData(
        {
          name,
          version,
          chainId,
          verifyingContract: await token.getAddress(),
        },
        {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        {
          owner: signer.address,
          spender,
          value,
          nonce,
          deadline,
        }
      )
    );
  }