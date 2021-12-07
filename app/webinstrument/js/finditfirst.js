let sketch = (p) => {
	let Stamper
	let Token
	let NFT
	let NFTMarket

	let forMint_finditfirstModifiedPathArray
	let forMint_finditfirstModifiedPathString


	
	let forMintName
    let forMintDescription
	let forMintColor
	let forMintPrice
	let nfts

	const marketAddress = "0x6806eCB13d6c826A95B69Cbc83258aC3612A3521"
	const NFTAddress = "0x2f3F71167EFa74b55DCd04bE82C68d3ad5a4fACC"
	// const tokenAddress = "0x54333c974b791399D043756DBC077F956aeA6978"
	// const stamperAddress = "0xF08DcdBb279175cf0742075b13990E878Bb35506"

	let b64_to_utf8 = (str) => {
		return decodeURIComponent(escape(window.atob(str)));
	}

	let generateDistortedfinditfirstInDOM = (_distortion, _SVGPoints3DArray, _finditfirstCommands, SVGDOMElement) => {
		let finditfirstModifiedPathArray = modifyShapeByDistortion(_distortion, _SVGPoints3DArray)
		let finditfirstModifiedPathString = convert3DArrayToDPathString(finditfirstModifiedPathArray, _finditfirstCommands)
		SVGDOMElement.setAttribute('d', finditfirstModifiedPathString)
		document.getElementById('finditfirst_svg').setAttribute('width', p.width)
		document.getElementById('finditfirst_svg').setAttribute('height', p.height)
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

	// let fetchStamp = async () => {
	// 	if (typeof window.ethereum !== 'undefined') {
	// 		const provider = new ethers.providers.Web3Provider(window.ethereum)
	// 		const contract = new ethers.Contract(stamperAddress, Stamper.abi, provider)
	// 		try {
	// 			const data = await contract.getStamp()
	// 			console.log('data: ', data)
	// 		} catch (err) {
	// 			console.log("Error: ", err)
	// 		}
	// 	}
	// }

	// call the smart contract, send an update
	// let setStamp = async () => {
	// 	if (!frase) return
	// 	if (typeof window.ethereum !== 'undefined') {
	// 		await requestAccount()
	// 		const provider = new ethers.providers.Web3Provider(window.ethereum);
	// 		const signer = provider.getSigner()
	// 		const contract = new ethers.Contract(stamperAddress, Stamper.abi, signer)
	// 		const transaction = await contract.setStamp(frase)
	// 		await transaction.wait()
	// 		fetchStamp()
	// 	}
	// }

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
	

	// call the smart contract, send an update
	let createNFTItem = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const [account] = await requestAccount();
			console.dir(account)
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			let contract = new ethers.Contract(NFTAddress, NFT.abi, signer)
			// Generate SVG Path
			
			// console.log(finditfirstModifiedPathString.length)
			console.log(`____________________________________________________________` )
			p.noLoop()

			// Generate NFT
			// let requestId = await contract.createRandomSVGNFT(finditfirstModifiedPathString, _name.replaceWithUtf8(), _description.replaceWithUtf8(), _color, {gasLimit: 5000000})
			// let tx = await requestId.wait(10);
			// '25000000000000000'
			
			const _mintprice = ethers.utils.parseUnits('0.02618', 'ether')
			tx = await contract.create({ gasLimit: 3000000, value: _mintprice})

			await new Promise(r => setTimeout(r, 180000))
			p.loop()
    		let receipt = await tx.wait(1)
    		// let tokenId = receipt.events[3].topics[2]

			// console.dir(requestId)
			console.log(`****____________________________________________________________` )
			console.dir(`El tokenId es: ${receipt}`)
			// console.log(`++++++++____________________________________________________________` )
		}
	}

	let finishMinting = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const [account] = await requestAccount();
			console.dir(account)
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			let contract = new ethers.Contract(NFTAddress, NFT.abi, signer)

			// let finditfirstModifiedPathArray = modifyShapeByDistortion(positionActual, finditfirstPoints3DArray)
			// let finditfirstModifiedPathString = convert3DArrayToDPathString(finditfirstModifiedPathArray, finditfirstCommands)

			// forMintDescription
			// forMintColor 
			// forMint_finditfirstModifiedPathString
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
		// const provider = new ethers.providers.JsonRpcProvider()
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider)
		const marketContract = new ethers.Contract(marketAddress, NFTMarket.abi, provider)
		console.log(`You can view the tokenURI here ${await tokenContract.tokenURI(2)}`)

		const data = await marketContract.fetchItemsCreated()
		// const data = await marketContract.fetchMarketItems()
		// await data.wait()

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
	async function buyNft() {
		// const web3Modal = new Web3Modal()
		// const connection = await web3Modal.connect()
		// const provider = new ethers.providers.Web3Provider(connection)

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


	let trace = false // are we tracing?
	let rg
	let now = 0
	let lastTextgeneratedTime = 0
	let words
	let glBandera = false
	let frase = ` `
	let started = true
	let canvasApp
	let nft = `finditfirst_`

	let finditfirstElement
	let finditfirstPath

	let fraseDiv
	let noiseScale = 0.02

	let xoff = 1.0
	let finditfirstPoints3DArray
	let finditfirstCommands
	let pathObj2
	let pathObj3

	let positionActual = 0.0
	let elapsedTime
	let tempcol = `#33ffccff`
	let someHeartBeatPeriod = 0
	let makeHexString = (length = 6) => {
		let result = ''
		let characters = 'ABCDEF0123456789'
		let charactersLength = characters.length
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	let modifyShapeByDistortion = (_distortion, _shapeData3DArray) => {
		let modifiedShapeData3DArray = []

		for (let jj = 0; jj < _shapeData3DArray.length; jj++) {
			modifiedShapeData3DArray[jj] = []
			for (let kk = 0; kk < _shapeData3DArray[jj].length; kk++) {
				modifiedShapeData3DArray[jj][kk] = []
				for (let ll = 0; ll < _shapeData3DArray[jj][kk].length; ll++) {
					const currentPoint = parseFloat(_shapeData3DArray[jj][kk][ll])
					if (!isNaN(currentPoint)) {
						xoff = xoff - 0.618
						let n = p.noise(xoff) * 0.618382 * p.map(_distortion, 0, 2, -128, 128)
						modifiedShapeData3DArray[jj][kk][ll] = parseInt(currentPoint + n)
					}
				}
			}
		}
		return modifiedShapeData3DArray
	}

	let convert3DArrayToDPathString = (shapeData3DArrayToConvert, _DPathCommands) => {
		let finditfirstPathModifiedArray = []
		for (let ii = 0; ii < _DPathCommands.length; ii++) {
			let commType = _DPathCommands[ii][0]
			let verifLast1 = _DPathCommands[ii][_DPathCommands[ii].length - 1]
			let verifLast2 = _DPathCommands[ii][_DPathCommands[ii].length - 2]
			let reconstructedCommand = commType // init with command type
			for (let i = 0; i < shapeData3DArrayToConvert[ii].length; i++) {
				reconstructedCommand += " " + (shapeData3DArrayToConvert[ii][i].toString())
			}
			if (verifLast1 == 'z' || verifLast2 == 'z') {
				reconstructedCommand += " " + 'z'
			}
			finditfirstPathModifiedArray.push(reconstructedCommand)
		}
		let finditfirstPathModified = finditfirstPathModifiedArray.join(' ')

		return finditfirstPathModified
	}

	let getPathDataFromDOMById = (svgPathId) => {
		let element = document.getElementById(svgPathId)
		let path = element.getAttribute('d')
		let commands = path.split(/(?=[lmcLMC])/)
		let result = commands.map((cmd) => {
			let pointsArray = cmd.slice(0, -1).split(' ')
			let pairsArray = []
			for (let i = 1; i < pointsArray.length; i += 1) {
				let pairToPush = pointsArray[i].split(',')
				if (pairToPush != 'z') {
					pairsArray.push(pairToPush)
				}
			}
			return pairsArray
		})
		return {
			"data":result,
			"commands": commands, 
			"element": element
		}
	}

	p.preload = () => {
		rg = new RiGrammar()
		let gramaticaLista = () => {
			let result = rg.expand()
			words = RiTa.tokenize(`${result} tomo una mordida!`)
			glBandera = true
		}
		// rg.loadFrom(`./../assets/finditfirst_en.json`, gramaticaLista)
		// // fetch("/assets/Stamper.json")
		// // 	.then(response => {
		// // 		return response.json()
		// // 	})
		// // 	.then(jsondata => {
		// // 		Stamper = jsondata;
		// // 	})
		// // fetch("/assets/Token.json")
		// // 	.then(response => {
		// // 		return response.json()
		// // 	})
		// // 	.then(jsondata => {
		// // 		Token = jsondata;
		// // 	})
		fetch("/assets/NFT.json")
			.then(response => {
				return response.json()
			})
			.then(jsondata => {
				NFT = jsondata;
			})
		fetch("/assets/NFTMarket.json")
			.then(response => {
				return response.json()
			})
			.then(jsondata => {
				NFTMarket = jsondata;
			})
	}

	p.setup = () => {
		canvasApp = p.createCanvas(p.windowWidth, p.windowHeight)
		canvasApp.style('display', 'block')
		canvasApp.id('canvas')
		canvasApp.position(0, 0, 'fixed')
		p.select('#initialDiv') ? p.select('#initialDiv').remove() : null
		p.frameRate(24)
		p.background(127) // clear the screen
		socket = io({
			transports: ['websocket']
		})
		socket.on('connect', () => {
			console.log(`Este cliente se ha conectado `);
		})
		socket.on('disconnect', () => {
			// socket.removeAllListeners()
		})
		socket.on('color',
			(data) => {
				if (finditfirstElement.style.display === "flow-root") {
					finditfirstElement.style.display = "block"
					finditfirstElement.style.fill = data
					tempcol = data
				} else {
					finditfirstElement.style.display = "flow-root"
					tempcol = data
					finditfirstElement.style.fill = tempcol
				}

				// TODO do some stuff here
				flag2 = true
			}
		)

		socket.on('position',
			(data) => {
				// TODO do some stuff here
				let sum = data.map((v) => {
					return +v
				}).reduce((a, b) => {
					return a + b
				})
				positionActual = parseFloat(sum)
				generateDistortedfinditfirstInDOM(positionActual, finditfirstPoints3DArray, finditfirstCommands, finditfirstElement)
				flag2 = false
			}
		)

		socket.on(`habitat`,
			(data) => {

			}
		)

		let pathObj1 = getPathDataFromDOMById('finditfirstSVGPath')
		pathObj2 = getPathDataFromDOMById('finditfirstSVGPath02')
		pathObj3 = getPathDataFromDOMById('finditfirstSVGPath03')

		finditfirstPoints3DArray = pathObj1.data
		finditfirstCommands = pathObj1.commands
		finditfirstElement = pathObj1.element

		generateDistortedfinditfirstInDOM( 1, finditfirstPoints3DArray, finditfirstCommands, finditfirstElement)
		generateDistortedfinditfirstInDOM( 1, pathObj2.data, pathObj2.commands, pathObj2.element)
		generateDistortedfinditfirstInDOM( 1, pathObj3.data, pathObj3.commands, pathObj3.element)

		someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 32) + 1)

	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		document.getElementById('finditfirst_svg').setAttribute('width', p.windowWidth)
		document.getElementById('finditfirst_svg').setAttribute('height', p.windowHeight)
		p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)
	}

	p.draw = () => {
		if (started) {
			now = p.millis()
			elapsedTime = now - lastTextgeneratedTime
			let altura = p.map(elapsedTime, 0, someHeartBeatPeriod, 0, p.height)
			if (elapsedTime < someHeartBeatPeriod) {
				p.fill(tempcol)
				p.noStroke()
				p.rect(0, 0, p.width / 8, altura)
			}
			if (elapsedTime > (someHeartBeatPeriod / 8) * 7) {
				p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 12)
			}
			if (elapsedTime > someHeartBeatPeriod) {
				p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)
				if (glBandera) {
					words = RiTa.tokenize(`${rg.expand()}`)
					lastTextgeneratedTime = now
					frase = ``
					for (let i = 0; i < words.length; i++) {
						if (words[i] === `,` && words[i] === `.`) {
							frase = frase + words[i]
						} else {
							frase = frase + ` ` + words[i]
						}
					}
					p.textSize(22)
					p.fill(tempcol.substring(0, 7))
					positionActual = ((Math.floor(Math.random() * p.windowWidth) + 1) + (Math.floor(Math.random() * p.windowHeight) + 1)) / (p.windowWidth + p.windowHeight)
					finditfirstElement.style.display = "flow-root"
					tempcol = "#" + makeHexString(8)
					finditfirstElement.style.fill = tempcol
					someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 48) + 6)
				}
				p.text(frase,
					((p.width / 2) - (p.width / 4)),
					((p.height / 2) - (p.height / 3)),
					((p.width / 2) + (p.width / 8)),
					((p.height / 2) + (p.height / 4))
				)
			}
			generateDistortedfinditfirstInDOM(positionActual, finditfirstPoints3DArray, finditfirstCommands, finditfirstElement)
			generateDistortedfinditfirstInDOM( positionActual, pathObj2.data, pathObj2.commands, pathObj2.element)
			generateDistortedfinditfirstInDOM( positionActual, pathObj3.data, pathObj3.commands, pathObj3.element)
		}
	}

	p.keyReleased = async () => {
		if (p.key === 'T') {
			html2canvas(document.body)
				.then(function (canvas) {
					const link = document.createElement('a')
					link.download = `${nft}${tempcol.substring(1)}_${positionActual}.png`
					link.href = canvas.toDataURL()
					link.click();
					link.delete;
				})
		}

		if (p.key === 'f') {
			finishMinting()
		}
		if (p.key === 's') {
			// setStamp()
			let userSelectedToken = prompt(`Which tokenId do you want to buy?`)
			saleNFTItem(forMintPrice,0)
		}
		if (p.key === 'b') {
			getBalance()
			nfts = await loadNFTs()
			console.dir(nfts)
		}
		if (p.key === 'm') {
			mynfts = await loadMyNFTs()
			console.dir(mynfts)
		}
		if (p.key === 'B') {
			console.dir(nfts)
			let userSelectedToken = prompt(`Which tokenId do you want to buy?`)
			buyNft()
			nfts = await loadNFTs()
		}
		if (p.key === 'X') {
			sendCoins('0x8bBd610542c67B355CC0152511ac2b3560F7d13c', 10000000000);
		}
		if (p.key === 'N') {
			p.noLoop()
			let user_name = prompt("Define a Name for this NFT?")
			let user_price = prompt("Set a price for this NFT?")
			while (isNaN(parseFloat(user_price))) {
				user_price = prompt("What is the price you pay for this NFT?")
			}

			forMintName = user_name
			forMintDescription = frase
			forMintColor = tempcol.substring(1)
			forMintPrice = user_price
			forMint_finditfirstModifiedPathArray = modifyShapeByDistortion(positionActual, finditfirstPoints3DArray)
			forMint_finditfirstModifiedPathString = convert3DArrayToDPathString(forMint_finditfirstModifiedPathArray, finditfirstCommands)

			createNFTItem(parseFloat(user_price))
		}
		if (p.key === 'k') {
			p.noLoop()
			let user_name = prompt("Define a Name for this NFT?")
			let user_price = prompt("Set a price for this NFT?")
			while (isNaN(parseFloat(user_price))) {
				user_price = prompt("What is the price you pay for this NFT?")
			}

			forMintName = user_name
			forMintDescription = frase
			forMintPrice = user_price
			forMintColor = tempcol.substring(1)
			forMint_finditfirstModifiedPathArray = modifyShapeByDistortion(positionActual, finditfirstPoints3DArray)
			forMint_finditfirstModifiedPathString = convert3DArrayToDPathString(forMint_finditfirstModifiedPathArray, finditfirstCommands)
		}
	}

	p.mousePressed = () => {
		started = true
		finditfirstElement.style.display = "flow-root"
		tempcol = "#" + makeHexString(8)
		pathObj2.element.style.fill = "#" + makeHexString(8)
		pathObj3.element.style.fill = "#" + makeHexString(8)
		finditfirstElement.style.fill = tempcol
		positionActual = (p.mouseY + p.mouseX) / (p.width + p.height)
		// modifyfinditfirst(positionActual)
		generateDistortedfinditfirstInDOM(positionActual, finditfirstPoints3DArray, finditfirstCommands, finditfirstElement)
		generateDistortedfinditfirstInDOM(positionActual, pathObj2.data, pathObj2.commands, pathObj2.element)
		generateDistortedfinditfirstInDOM(positionActual, pathObj3.data, pathObj3.commands, pathObj3.element)
		let currentJWT = window.localStorage.getItem('userJWT')
		let oHeader = {
			alg: 'HS256',
			typ: 'JWT'
		}
		let oPayload = {
			"user": {
				"mouseX": `${p.mouseX/p.width}`,
				"mouseY": `${p.mouseY/p.height}`,
				"color": tempcol,
			}
		}
		let sHeader = JSON.stringify(oHeader)
		let sPayload = JSON.stringify(oPayload)
		let signedCommands = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, currentJWT)
		socket.emit(`LED`, signedCommands + `;` + currentJWT)
		
	}
}