const marketAddress = "0x6806eCB13d6c826A95B69Cbc83258aC3612A3521"
const NFTAddress = "0x2f3F71167EFa74b55DCd04bE82C68d3ad5a4fACC"

String.prototype.replaceWithUtf8 = function() {
    function r(r) {
      for (var t, n, e = "", i = 0; !isNaN(t = r.charCodeAt(i++)); ) n = t.toString(16), 
      e += 256 > t ? "\\\\x" + (t > 15 ? "" :"0") + n :"\\u" + ("0000" + n).slice(-4);
      return e;
    }
    var a, c, o, u, s, e = "", i = this, t = [ "/", '"' ], n = [ "\\/", '\\"' ];
    for (a = 0; a < i.length; a++) c = i.charCodeAt(a), o = i.charAt(a), u = t.indexOf(o), 
    u > -1 ? e += n[u] :c > 126 && 65536 > c ? (s = r(o), e += s) :e += o;
    return e;
  };

  String.prototype.decodeEscapeSequence = function() {
    return this.replace(/\\x([0-9A-Fa-f]{2})/g, function() {
        return String.fromCharCode(parseInt(arguments[1], 16));
    });
};

let b64_to_utf8 = (str) => {
    return decodeURIComponent(escape(window.atob(str)));
}

let requestAccount = async () => {
    return await window.ethereum.request({
        method: 'eth_requestAccounts'
    });
}

let getBalance = async () => {
    // if (typeof window.ethereum !== 'undefined') {
    // 	const [account] = await window.ethereum.request({
    // 		method: 'eth_requestAccounts'
    // 	})
    // 	const provider = new ethers.providers.Web3Provider(window.ethereum);
    // 	const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
    // 	const balance = await contract.balanceOf(account);
    // 	console.log("Balance: ", balance.toString());
    // }
}

let sendCoins = async (userAccount, amount) => {
    // if (typeof window.ethereum !== 'undefined') {
    // 	await requestAccount()
    // 	const provider = new ethers.providers.Web3Provider(window.ethereum);
    // 	const signer = provider.getSigner();
    // 	const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
    // 	const transation = await contract.transfer(userAccount, amount);
    // 	await transation.wait();
    // 	console.log(`${amount} Coins successfully sent to ${userAccount}`);
    // }
}

// call the smart contract, send an update
let createNFTItem = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const [account] = await requestAccount();
        console.dir(account)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(NFTAddress, NFT.abi, signer)
        // Generate SVG Path
        p.noLoop()
        const _mintprice = ethers.utils.parseUnits('0.02618', 'ether')
        tx = await contract.create({ gasLimit: 3000000, value: _mintprice})
        await new Promise(r => setTimeout(r, 180000))
        p.loop()
        let receipt = await tx.wait(1)
        console.dir(`El tokenId es: ${receipt}`)
    }
}

let finishMinting = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const [account] = await requestAccount();
        console.dir(account)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(NFTAddress, NFT.abi, signer)
        let selectedTokenId = parseInt(prompt("Select tokenId: "))
        let transaction = await contract.finishMint(selectedTokenId, forMint_finditfirstModifiedPathString, forMintName.replaceWithUtf8(), forMintDescription.replaceWithUtf8(), forMintColor);
        await transaction.wait()
        console.log(`You can view the tokenURI here ${await contract.tokenURI(selectedTokenId)}`)
        p.loop()
    }
}

let saleNFTItem = async (_price, _tokenId) => {
    if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const price = ethers.utils.parseUnits(_price, 'ether')
        let contract = new ethers.Contract(marketAddress, NFTMarket.abi, signer)
        let listingPrice = await contract.getListingPrice()
        transaction = await contract.createMarketItem(NFTAddress, _tokenId, price, {
            value: listingPrice
        })
        await transaction.wait()
    }
}

let loadNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, provider)
    console.log(`You can view the tokenURI here ${await tokenContract.tokenURI(2)}`)
    const data = await marketContract.fetchItemsCreated()
    const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        let splitedToken = `${b64_to_utf8(tokenUri.split(',')[1])}`
        const meta = JSON.parse(splitedToken.decodeEscapeSequence())
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item
    }))

    console.log(items)
    return items
}

let loadMyNFTs = async () => {
    // const provider = new ethers.providers.JsonRpcProvider()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, provider)
    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        let splitedToken = `${b64_to_utf8(tokenUri.split(',')[1])}`
        const meta = JSON.parse(splitedToken.decodeEscapeSequence())
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item
    }))
    return items
}
let buyNft = async() =>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketAddress, NFTMarket.abi, signer)
    const price = ethers.utils.parseUnits('0.09', 'ether')
    const transaction = await contract.createMarketSale(NFTAddress, 0, {
        value: price
    })
    await transaction.wait()
    await loadNFTs()
}