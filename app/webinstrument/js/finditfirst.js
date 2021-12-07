let sketch = (p) => {
	let now = 0
	let lastGeneratedTime = 0
	let canvasApp
	let filename_prefix = `finditfirst_`

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

	p.preload = () => {
		
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
				console.log(data)
			}
		)
		socket.on('position',
			(data) => {
				console.log(data)
			}
		)
		socket.on(`habitat`,
			(data) => {
				console.log(data)
			}
		)
		someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 32) + 1)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)
	}

	p.draw = () => {
		now = p.millis()
		elapsedTime = now - lastGeneratedTime
		let altura = p.map(elapsedTime, 0, someHeartBeatPeriod, 0, p.height)
		if (elapsedTime < someHeartBeatPeriod) {
			p.fill(tempcol)
			p.noStroke()
			p.rect(0, 0, p.width / 8, altura)
		}
		if (elapsedTime > someHeartBeatPeriod) {
			p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)	
			lastGeneratedTime = now
			tempcol = "#" + makeHexString(8)
			someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 48) + 6)
		}
	}

	p.keyReleased = async () => {
		if (p.key === 'T') {
			html2canvas(document.body)
				.then(function (canvas) {
					const link = document.createElement('a')
					link.download = `${filename_prefix}${tempcol.substring(1)}.png`
					link.href = canvas.toDataURL()
					link.click();
					link.delete;
				})
		}

		if (p.key === 'f') {
			
		}
		if (p.key === 's') {
			
		}
		if (p.key === 'b') {
			
		}
		if (p.key === 'm') {
			
		}
		if (p.key === 'B') {
			
		}
		if (p.key === 'X') {
			
		}
		if (p.key === 'N') {
			
		}
		if (p.key === 'k') {
			
		}
	}

	p.mousePressed = () => {
		
		tempcol = "#" + makeHexString(8)
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