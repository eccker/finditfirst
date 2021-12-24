let sketch = (p) => {
	let now = 0
	let lastGeneratedTime = 0
	let canvasApp
	let filename_prefix = `finditfirst_`

	let imgDragged

	let elapsedTime
	let tempcol = `#33ffccff`
	let someHeartBeatPeriod = 0

	let micarta
	let cartaopuesta
	let misCartas = []
	let photodata

	let cards = []
	let _indexx = 0
	let _indexy = 0

	let draw_allowed;
	let x1 = 100,
		y1 = 100
	let draw_1, d1, t1, t2


	let makeHexString = (length = 6) => {
		let result = ''
		let characters = 'ABCDEF0123456789'
		let charactersLength = characters.length
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	let encodeSendJWTMessage = (_objectToSend) => {

		let currentJWT = window.localStorage.getItem('userJWT')
		let oHeader = {
			alg: 'HS256',
			typ: 'JWT'
		}

		let oPayload = {
			"user": {
				"object": _objectToSend,
			}
		}
		let sHeader = JSON.stringify(oHeader)
		let sPayload = JSON.stringify(oPayload)
		let signedCommands = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, currentJWT)
		socket.emit(`server`, signedCommands + `;` + currentJWT)
	}


	let encodeSendJWTData = (_dataToSend) => {

		let currentJWT = window.localStorage.getItem('userJWT')
		let oHeader = {
			alg: 'HS256',
			typ: 'JWT'
		}

		let oPayload = {
			"user": {
				"data": _dataToSend,
			}
		}
		let sHeader = JSON.stringify(oHeader)
		let sPayload = JSON.stringify(oPayload)
		let signedCommands = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, currentJWT)
		socket.emit(`server`, signedCommands + `;` + currentJWT)
	}

	p.preload = () => {
		cards[0] = p.loadImage('https://images.unsplash.com/photo-1451226428352-cf66bf8a0317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHw4fHx3b3JkfGVufDB8MHx8fDE2MzkxNTYwMTg&ixlib=rb-1.2.1&q=80&w=200');


	}

	p.setup = () => {
		canvasApp = p.createCanvas(p.windowWidth, p.windowHeight)
		canvasApp.style('display', 'block')
		canvasApp.id('canvas')
		canvasApp.position(0, 0, 'fixed')
		p.select('#initialDiv') ? p.select('#initialDiv').remove() : null
		p.frameRate(24)
		p.background(127) // clear the screen
		p.imageMode(p.CENTER);
		draw_allowed = true;

		socket = io({
			transports: ['websocket']
		})
		socket.on('connect', () => {
			console.log(`Este cliente se ha conectado `);
		})
		socket.on('disconnect', () => {
			socket.removeAllListeners()
		})
		socket.on('channel01',
			(data) => {
				console.log(data)
			}
		)
		socket.on('channel02',
			(data) => {
				if (data == undefined) return
				if (micarta.imgs.length > 5) {
					micarta.imgs = []
					micarta.data = []
				}
				p.loadImage(data.urls.thumb, _img => {
					micarta.imgs.push(_img)
					micarta.data.push(data)
				})
			}
		)
		socket.on(`channel03`,
			(data) => {
				if (data == undefined) return
				if (cartaopuesta.imgs.length > 5) {
					cartaopuesta.imgs = []
					cartaopuesta.data = []
				}
				p.loadImage(data.urls.thumb, _img => {
					cartaopuesta.imgs.push(_img)
					cartaopuesta.data.push(data)
				})
			}
		)
		cartaopuesta = new Card(0, 0)
		cartaopuesta.initCards(p)

		micarta = new Card(0, p.height / 2)
		micarta.initCards(p)


		const objectToSend = micarta.objs[Math.floor(Math.random() * micarta.objs.length)]
		for (let index = 0; index < 6; index++) {
			encodeSendJWTData(objectToSend)
		}
		someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 32) + 1)
		draw_allowed = true;
		p.background(10, 10, 10, 251)
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		p.background(10, 10, 10, 251)
		// p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)
	}

	p.draw = () => {
		if (draw_allowed) {
			if (draw_1) {
				p.background(10, 10, 10, 251)
				micarta.locationsX[imgDragged] = p.mouseX - t1;
				micarta.locationsY[imgDragged] = p.mouseY - t2;
			}
		}
		cartaopuesta.show(p)
		micarta.show(p)

		now = p.millis()
		elapsedTime = now - lastGeneratedTime
		let altura = p.map(elapsedTime, 0, someHeartBeatPeriod, 0, p.height)
		if (elapsedTime < someHeartBeatPeriod) {
			p.fill(tempcol)
			p.noStroke()
			p.rect(0, 0, p.width / 8, altura)
		}
		if (elapsedTime > someHeartBeatPeriod) {
			lastGeneratedTime = now

			someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 48) + 8)
			tempcol = "#" + makeHexString(8)

			const objectToSend = micarta.objs[Math.floor(Math.random() * micarta.objs.length)]
			for (let index = 0; index < 6; index++) {
				encodeSendJWTData(objectToSend)
				encodeSendJWTMessage(objectToSend)

			}
			p.background(10, 10, 10, 251)
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
			const objectToSend = cartaopuesta.objs[Math.floor(Math.random() * micarta.objs.length)]
			for (let index = 0; index < 6; index++) {
				encodeSendJWTMessage(objectToSend)
			}
		}
		if (p.key === 'm') {
			const objectToSend = micarta.objs[Math.floor(Math.random() * micarta.objs.length)]
			for (let index = 0; index < 6; index++) {
				encodeSendJWTData(objectToSend)
			}
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
		for (let idx = 0; idx < micarta.imgs.length; idx++) {
			if (micarta.checkPressed(p, idx)) {
				console.log(`pressed ${idx}`)
				draw_allowed = true;
				imgDragged = idx
				t1 = p.map(p.mouseX - (micarta.locationsX[idx] - micarta.imgs[idx].width / 2), 0, micarta.imgs[idx].width, -micarta.imgs[idx].width / 2, micarta.imgs[idx].width / 2)
				t2 = p.map(p.mouseY - (micarta.locationsY[idx] - micarta.imgs[idx].height / 2), 0, micarta.imgs[idx].height, -micarta.imgs[idx].height / 2, micarta.imgs[idx].height / 2)
				d1 = 0;
			}
		}
	}

	p.mouseReleased = () => {
		draw_allowed = false;
		draw_1 = false;
		for (let idx = 0; idx < micarta.imgs.length; idx++) {
			if (micarta.checkOver(p, imgDragged, cartaopuesta, idx)) {
				console.log(`my card ${imgDragged} is over card ${idx}`)
				let thisImgData = micarta.data[imgDragged]
				console.log(`It took you ${elapsedTime/1000} s to complete`)
				p.background(10, 10, 10, 251)
				if (thisImgData.id === cartaopuesta.data[idx].id) {
					console.log(`Incredible, you found a match! it took you ${elapsedTime} ms to complete`)
					micarta.locationsX[imgDragged] = cartaopuesta.locationsX[idx]
					micarta.locationsY[imgDragged] = cartaopuesta.locationsY[idx]
				} else {
					micarta.locationsX[imgDragged] = micarta.imgs[imgDragged].width / 2 + p.width / 8 + ((p.width / 4) * (imgDragged % 3)) + micarta.x;
					if (imgDragged < 3) {
						micarta.locationsY[imgDragged] = (micarta.imgs[imgDragged].height / 2) + ((p.height / 4) * (0)) + micarta.y;
					} else {
						micarta.locationsY[imgDragged] = (micarta.imgs[imgDragged].height / 2) + ((p.height / 4) * (1)) + micarta.y;
					}
				}

			}
		}
	}

	p.mouseDragged = () => {
		if (d1 < 100) {
			draw_1 = true;
			return;
		}
	}


}