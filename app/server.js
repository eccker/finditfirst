let default_SERVER_KEY = process.env.SERVER_KEY || 'default_SERVER_KEY';
console.log(default_SERVER_KEY + ': ' + process.env.SERVER_KEY);
// ask for parameters from the cli
let arguments = []
let badArg = false

// Initialize variables to default values
arguments[0] = `dev` // dev, production

// retrieve and process command line argumets as key=value tokens
let argumentsRAW = process.argv.slice(2)
argumentsRAW.forEach(element => {
	let [key, value] = element.split(`=`)
	switch (key) {
		case "mode":
			if (value === `dev` || value === `production`) {
				arguments[0] = value
			} else {
				console.log(`Mode ${value} is not recognized, only 'dev' or 'production' strings types allow`)
				badArg = true
			}
			break
		default:
			console.log(`Argument ${key} is not recognized`)
			badArg = true
			break
	}
})

// Exit program if argumet is not recognized
if (badArg) {
	console.log(`Exit....`)
	return
}

let serverPath = ``
const runMode = arguments[0]
if (runMode === `dev`) {
	serverPath = '/webinstrument/'
} else if (runMode === `production`) {
	serverPath = '/webinstrument/build/es6-bundled/'
}

// -------- cloud infrastructure, setting and configurations
require('console-stamp')(console, '[HH:MM:ss.l]')
require('dotenv').config();
let app = require('express')()
let serveStatic = require('serve-static')
let compression = require('compression')
let cookieSession = require('cookie-session')
let fs = require('fs')
let bodyParser = require('body-parser')
let port = process.env.PORT || 9003
const jsonwebtoken = require('jsonwebtoken')
const cors = require('cors')

let makeSecret = (length) => {
	let result = ``
	let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
	let charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

let secret1 = makeSecret(32)
let secret2 = makeSecret(32)

app.use(cors());
app.use(compression({
	level: 9
}))
// store session state in browser cookie
app.use(cookieSession({
	keys: [`${secret1}`, `${secret2}`]
}))
// parse urlencoded request bodies into req.body
app.use(bodyParser.urlencoded({
	extended: false
}))

app.get('/privacy', (req, res) => {
	const privacy = require('./legal.js').privacy;
	res.send(privacy);
}).get('/terms', (req, res) => {
	const terms = require('./legal.js').terms;
	res.send(terms);
}).get('/token/:tokenStr/:randomKey', (req, res) => {
	console.log(`token requested`)
	let decoded
	try {
		decoded = jsonwebtoken.verify(req.params.tokenStr, req.params.randomKey)
	} catch (err) {
		console.error(`{"error":"unauthorized access or error token request"}`)
		res.send({
			"error": "unauthorized access or error request"
		})
		return null
	}
	const uname = `${makeSecret(32)}_${decoded.credentials.username}`
	const hpssd = `${makeSecret(32)}_${decoded.credentials.hashedpassword}`
	const hashid = `${makeSecret(32)}_${decoded.user.id}`
	const hashname = `${makeSecret(32)}_${decoded.user.name}`
	const hashnounce = `${makeSecret(32)}_${decoded.user.nounce}`

	let oPayload = {
		"user": {
			"id": hashid,
			"name": hashname,
			"nounce": hashnounce,
		},
		"credentials": {
			"username": uname, // TODO obtain this from user
			"hashedpassword": hpssd // TODO obtain this from user
		}
	}

	let sPayload = JSON.stringify(oPayload, null, 4)
	let token = jsonwebtoken.sign(sPayload, default_SERVER_KEY)
	// TODO send token by email when is registering
	res.send(token)

}).get('/auth/:authTokenStr/:hashedPassword', (req, res) => {
	let decoded
	try {
		decoded = jsonwebtoken.verify(req.params.authTokenStr, default_SERVER_KEY)
		// TODO create a user in the database if is the first login 
	} catch (err) {
		console.error(`{"errorAUTH":"unauthorized access or error auth request"}`)
		res.send({
			"error": "unauthorized access or error token request"
		})
		return null;
	}
	// TODO 
	if (decoded.credentials.hashedpassword.length > 64) {
		let retrievedHP = `${decoded.credentials.hashedpassword}`.substring(33) // retrieved from JWT token
		let userHP = req.params.hashedPassword
		if (userHP === retrievedHP) {
			res.send(decoded.user.id.substring(33))
		} else {
			res.send({
				"error": "unauthorized access or error hashed password request"
			})
		}
	} else {
		res.send({
			"error": "unauthorized access or error request auth"
		})
	}
})

// -------- RUN SERVER
const server = app.use(serveStatic(__dirname + serverPath)).listen(port, () => {
	console.log(`'finditfirst' esta corriendo por el puerto ${port} en modo ${arguments[0]}`)
})

// const {
// 	createApi
// } = require('unsplash-js');
// const nodeFetch = require('node-fetch');
// const {
// 	error
// } = require('console');

// const unsplash = createApi({
// 	accessKey: '7pa6kOrgWDuhpvhQR9vCfAy1W_nkSeouS2ClEEVkatQ',
// 	fetch: nodeFetch,
// });



// -------- Cloud App, business logic 
let io = require('socket.io')(server, {
	transports: ['websocket'],
	allowRequest: (handshake, callback) => {
		var cookie, token, authPair, parts;
		// check for headers
		if (handshake.headers.cookie &&
			handshake.headers.cookie.split('=')[0] == 'finditfirstapp') {
			// found request cookie, parse it
			cookie = handshake.headers.cookie
			token = cookie.split(/=(.+)/)[1] || ''
			authPair = Buffer.from(token, 'base64').toString()
			parts = authPair.split(/:/)
			if (parts.length >= 1) {
				for (let index = 0; index < parts.length; index++) {
					let decoded
					try {
						decoded = jsonwebtoken.verify(parts[index], default_SERVER_KEY)
					} catch (err) {
						console.log(`Error happens: ${err}`)
						return null;
					}
				}
				callback(null, true);
			} else {
				console.log(`Condition parts.length<1 happened, parts is:${parts}`)
				// not what we were expecting
				callback(null, false)
			}
		} else {
			// auth failed
			callback(null, false)
		}
	}
});
let allClients = []
io.on('connection', (socket) => {
	console.log('Un cliente se ha conectado con id: ', socket.id)
	allClients.push(socket)
	socket.on(`disconnect`, () => {
		console.log(`Got disconnected from ${socket.id}`)
		// let i = allClients.indexOf(socket)
		// allClients.splice(i, 1)
	})

	socket.on(`server`, (data) => {
		const elements = data.split(";")
		const commands = elements[0]
		const uJWT = elements[1]
		let decoded
		let decoded2
		let id
		let name
		let nounce
		try {
			decoded = jsonwebtoken.verify(uJWT, default_SERVER_KEY)
			id = decoded.user.id
			name = decoded.user.name
			nounce = decoded.user.nounce
			//TODO look for this in DB
		} catch (err) {
			console.error(`{"error":"unauthorized access or error auth request"}`)
			return null;
		}
		try {
			decoded2 = jsonwebtoken.verify(commands, uJWT)
			let keys = Object.keys(decoded2.user)
			keys.forEach(key => {

				if (key === 'data') {
					console.log(`key is: ${key}`)
					console.log(decoded2.user.data)

					fs.readdir(`./data`, (err, files) => {
						let filetoopen = files[Math.floor(Math.random() * (files.length + 1))]
						console.log(filetoopen)
						fs.readFile(`./data/${filetoopen}`, 'utf8', (err, data) => {
							if (err) {
								console.log(`Error reading file from disk: ${err}`);
							} else {
								// parse JSON string to JSON object
								const objectFromFile = JSON.parse(data);
								const objFromFile = objectFromFile[Math.floor(Math.random() * (objectFromFile.length))];
								// console.log(`objFromFileThumbURL is: ${objFromFile.urls.thumb}`)
								io.emit(`channel02`, objFromFile)
							}
						});
					});


				}
				if (key === 'buffer') {
					let buffLenght = decoded2.user.buffer
					let chnnl = decoded2.user.channel
					for (let idxBuff = 0; idxBuff < buffLenght; idxBuff++) {
						fs.readdir(`./data`, (err, files) => {
							let filetoopen = files[Math.floor(Math.random() * (files.length + 1))]
							console.log(filetoopen)
							fs.readFile(`./data/${filetoopen}`, 'utf8', (err, data) => {
								if (err) {
									console.log(`Error reading file from disk: ${err}`);
								} else {
									const objectFromFile = JSON.parse(data);
									const objFromFile = objectFromFile[Math.floor(Math.random() * (objectFromFile.length))];
									console.log(`On channel: ${chnnl} and ${JSON.stringify(objFromFile?.id,null, 4)}`)

                                    // const IDs = {objFromFile?.id, objFromFile?.urls};
                                    const IDs = {id:objFromFile.id, urls:objFromFile.urls}
                                    // console.log(IDs)
									io.emit(chnnl, IDs)
								}
							});
						});						
					}
				}
				// if (key === 'mouseX') {
				// 	io.emit(`channel02`, [decoded2.user.mouseX, decoded2.user.mouseY])
				// }
				// if (key === 'object') {
				// 	console.log(decoded2.user.object)
				// 	fs.readdir(`./data`, (err, files) => {
				// 		let filetoopen = files[Math.floor(Math.random() * (files.length + 1))]
				// 		console.log(filetoopen)
				// 		fs.readFile(`./data/${filetoopen}`, 'utf8', (err, data) => {
				// 			if (err) {
				// 				console.log(`Error reading file from disk: ${err}`);
				// 			} else {
				// 				// parse JSON string to JSON object
				// 				const objectFromFile = JSON.parse(data);
				// 				const objFromFileThumbURL = objectFromFile[Math.floor(Math.random() * (objectFromFile.length))];
				// 				console.log(`objFromFileThumbURL is: ${objFromFileThumbURL.urls.thumb}`)
				// 				io.emit(`channel03`, objFromFileThumbURL)
				// 			}
				// 		});
				// 	});

				// }

			})

		} catch (err) {
			return null;
		}




	})
})