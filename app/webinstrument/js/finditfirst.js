let sketch = (p) => {
	let now = 0
	let lastGeneratedTime = 0
	let canvasApp
	let filename_prefix = `finditfirst_`

	let elapsedTime
	let tempcol = `#33ffccff`
	let someHeartBeatPeriod = 0

	let micarta
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
				console.log(data)

				if (misCartas.length > 5) {
					misCartas = []
				}

				if (data == undefined) return
				p.loadImage(data.urls.thumb, _img => {
					misCartas.push(_img)
				})
			}
		)
		socket.on(`channel03`,
			(data) => {
				// console.log(data)
				// photodata = data
				// p.loadImage(data.urls.thumb, _img => {
				// 	cards.push(_img)

				// 	p.image(_img, _img.width/2 + p.width / 8 + ((p.width / 4) * _indexx), (_img.height / 2) + ((p.height / 4) * _indexy))
				// 	_indexx++

				// 	if (cards.length % 1 === 0) {
				// 		_indexx = 0
				// 		_indexy++
				// 		if (_indexy >= 4) {
				// 			_indexy = 0
				// 		}
				// 	}
				// })
			}
		)
		micarta = new Card(p.width / 2, p.height / 2)
		// encodeSendJWTData({
		// 	"hola": "mundo"
		// })

		micarta.shuffle(micarta.objs.length)
		// console.log(micarta.objs)
		tempcol = "#" + makeHexString(8)
		const objectToSend = micarta.objs[Math.floor(Math.random() * micarta.objs.length)]
		for (let index = 0; index < 6; index++) {
			encodeSendJWTData(objectToSend)
		}

		someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 32) + 1)


		draw_allowed = true;
	}

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight)
		p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)
	}

	p.draw = () => {
		micarta._indexx++
		if (micarta._indexx % 3 === 0) {
			micarta._indexx = 0
			micarta._indexy++
			if (micarta._indexy % 2 === 0) {
				micarta._indexy = 0
				micarta._indexx = 0
			}
		}
		let imageIndex = micarta._indexx + (micarta._indexy * 3)
		let localimage = misCartas[imageIndex]
		micarta.img = localimage
		micarta.show(p)

		if (draw_allowed) {
			if (draw_1) {
				x1 = p.mouseX - t1;
				y1 = p.mouseY - t2;
			}
			if (localimage) {
				p.image(misCartas[0], x1, y1);
			}
		}


		now = p.millis()
		elapsedTime = now - lastGeneratedTime
		let altura = p.map(elapsedTime, 0, someHeartBeatPeriod, 0, p.height)
		if (elapsedTime < someHeartBeatPeriod) {
			p.fill(tempcol)
			p.noStroke()
			p.rect(0, 0, p.width / 8, altura)
		}
		if (elapsedTime > someHeartBeatPeriod) {
			// p.background(p.random(19, 28), p.random(26, 28), p.random(26, 35), 255)	
			// p.background(127,127,127,255)
			lastGeneratedTime = now
			tempcol = "#" + makeHexString(8)
			someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * 48) + 6)
		}

		// micarta.show(p)

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
			micarta.shuffle(micarta.objs.length)
			// console.log(micarta.objs)
			tempcol = "#" + makeHexString(8)
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

		draw_allowed = true;
		if (p.mouseX > x1 - cards[0].width / 2 && p.mouseX < x1 + cards[0].width / 2) {
			if (p.mouseY > y1 - cards[0].height / 2 && p.mouseY < y1 + cards[0].height / 2) {
				t1 = p.map(p.mouseX - (x1 - cards[0].width / 2), 0, cards[0].width, -cards[0].width / 2, cards[0].width / 2)
				t2 = p.map(p.mouseY - (y1 - cards[0].height / 2), 0, cards[0].height, -cards[0].height / 2, cards[0].height / 2)
				d1 = 0;
			} else {
				d1 = 101;
			}
		} else {
			d1 = 101;
		}

	}

	p.mouseReleased = () => {
		draw_allowed = false;
		draw_1 = false;
	}

	p.mouseDragged = () => {
		if (d1 < 100) {
			draw_1 = true;
			return;
		}
	}


}