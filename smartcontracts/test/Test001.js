const { expect } = require("chai");
const { VoucherMaker } = require('../lib')

describe("Find It First Smart Contract Test", () => {
    let hardhatToken
    let fif
    let owner
    let player1
    let player2
    beforeEach(async function () {
        [owner, player1, player2] = await ethers.getSigners();
        hardhatToken = await ethers.deployContract("FindItFirstToken", [100]);
        
        fif = await ethers.deployContract("FIF", [hardhatToken.target], owner);
        console.log('FIF address is:' + fif.target)
        await hardhatToken.connect(owner).mint(player1.address, 100);
        await hardhatToken.connect(owner).mint(player2.address, 100);

        await hardhatToken.connect(player1).approve(fif.target, 20)
        await hardhatToken.connect(player2).approve(fif.target, 20)

        await fif.connect(player1).transferirTokens(15)
        await fif.connect(player2).transferirTokens(16)
    });

    // it("Deployment should assign the total supply of tokens to the owner", async function () {
    //     const ownerBalance = await hardhatToken.balanceOf(owner.address);
    //     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    //     expect(await hardhatToken.balanceOf(player1.address)).to.equal(0);
    //     expect(await hardhatToken.balanceOf(player2.address)).to.equal(0);
    // });

    // it("Fund players with tokens equivalent to 100", async () => {
    //     // Mint some tokens for players
    //     expect(await hardhatToken.balanceOf(player1.address)).to.equal(100)
    //     expect(await hardhatToken.balanceOf(player2.address)).to.equal(100)
    // })

    // it("Player should transfer tokens to smart contract", async () => {
    //     await hardhatToken.connect(player1).approve(fif.target, 10)
    //     await hardhatToken.connect(player2).approve(fif.target, 10)
    //     expect(await fif.connect(player1).transferirTokens(10)).to.emit(fif, "TransferTokens").withArgs(player1.address, 10)
    //     expect(await fif.connect(player2).transferirTokens(10)).to.emit(fif, "TransferTokens").withArgs(player2.address, 10)
    // })

    it("It should redeem a voucher", async () => {
        const voucherMaker = new VoucherMaker({ contract: fif, signer: owner })
        let voucherID = 1,
        winnerReward = 20, 
        winnerBet = 10, 
        loserBet = 10
        winnerAddress =  `${player1.address}`, 
        loserAddress = `${player2.address}`, 
        
        console.log('la direccion de owner es: '+ owner.address)
        console.log('la direccion de winnerAddress es: '+ winnerAddress)
        const voucher = await voucherMaker.createVoucher(voucherID, winnerReward, winnerBet, loserBet, winnerAddress, loserAddress)
        console.log('voucher  es: '+ JSON.stringify(voucher,null,4))

        expect(await fif.redeem(voucher))
        .to.emit(fif, 'RewardRedeemed')  // transfer from null address to minter
        .withArgs(voucher.winnerAddress, voucher.winnerReward)
    
    })
});