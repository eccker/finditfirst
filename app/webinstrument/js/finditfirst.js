
let sketch = (p) => {
    const ethers = window.moduleExports;
    let provider
    let signer

    let setupReady = false
    let preloadReady = false
    

    const INITIAL_DIFFICULTY = 16
    let now = 0
    let lastGeneratedTime = 0
    let canvasApp
    let filename_prefix = `finditfirst_`

    let imgDragged

    let elapsedTime
    let tempcol = `#33ffccff`
    let someHeartBeatPeriod = 0
    let minTime = 12.0
    let ranTime = 68.0
    let bleedRate = 0.16

    let topDeck
    let bottomDeck
    let bufferDeckData = []
    let bufferDeckImgs = []

    let difficulty = INITIAL_DIFFICULTY
    let shuffles = 0

    let draw_allowed;
    let draw_1, d1, t1, t2

    let elapsedTimesRegistered = []
    let scores = []
    let lifes = 3
    let socket

    let gameStatus = `ready`
    let verifyWon = false

    let opDeckBtn


    let channel

    let gridSpaceX
    let gridSpaceY

    let textSize


    let makeHexString = (length = 6) => {
        let result = ''
        let characters = 'ABCDEF0123456789'
        let charactersLength = characters.length
        for (var i = 0; i < length; i++) {
            // result += characters.charAt(Math.floor(Math.random() * charactersLength))
            result += characters.charAt(getRandomInt(charactersLength));

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

    let encodeSendJWTData = (_dataToSend, _channel) => {

        let currentJWT = window.localStorage.getItem('userJWT')
        let oHeader = {
            alg: 'HS256',
            typ: 'JWT'
        }

        let oPayload = {
            "user": {
                "data": _dataToSend,
                "channel": _channel
            }
        }
        let sHeader = JSON.stringify(oHeader)
        let sPayload = JSON.stringify(oPayload)
        let signedCommands = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, currentJWT)
        socket.emit(`server`, signedCommands + `;` + currentJWT)
    }

    let encodeSendJWTRequestBuffer = (buffLength = 16, _channel) => {

        let currentJWT = window.localStorage.getItem('userJWT')
        let oHeader = {
            alg: 'HS256',
            typ: 'JWT'
        }

        let oPayload = {
            "user": {
                "buffer": buffLength,
                "channel": _channel,
            }
        }
        let sHeader = JSON.stringify(oHeader)
        let sPayload = JSON.stringify(oPayload)
        let signedCommands = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, currentJWT)
        socket.emit(`server`, signedCommands + `;` + currentJWT)
    }

    let cropAndResizeImage = (img, targetW, targetH) => {
        let imgAspect = img.width / img.height;
        let targetAspect = targetW / targetH;

        let cropWidth, cropHeight;
        if (imgAspect > targetAspect) {

            cropWidth = img.height * targetAspect;
            cropHeight = img.height;
        } else {

            cropWidth = img.width;
            cropHeight = img.width / targetAspect;
        }


        let x = (img.width - cropWidth) / 2;
        let y = (img.height - cropHeight) / 2;


        let gfx = p.createGraphics(targetW, targetH);
        gfx.image(img, 0, 0, targetW, targetH, x, y, cropWidth, cropHeight);

        return gfx;
    }
    const getRandomNumber = (min, max) => {
        const range = max - min;
        const bytes = new Uint32Array(1);
        window.crypto.getRandomValues(bytes);
        const randomNumber = bytes[0] / (0xffffffff + 1);
        return min + randomNumber * range;
    }

    const getRandomInt = (max) => {
        const bytes = new Uint32Array(1);
        window.crypto.getRandomValues(bytes);
        return Math.floor(bytes[0] / (0xffffffff + 1) * max);
    }

    p.preload = () => {
        gridSpaceX = p.windowWidth / 32
        gridSpaceY = p.windowHeight / 32
        console.log(`PRELOAD`)
    }

    p.setup = async () => {
        
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        console.log("P5JS: Signer:", signer);
        console.log("P5JS: Account:", await signer.getAddress())

        canvasApp = p.createCanvas(p.windowWidth, p.windowHeight)
        canvasApp.style('display', 'block')
        canvasApp.id('canvas')
        canvasApp.position(0, 0, 'fixed')
        p.select('#initialDiv') ? p.select('#initialDiv').remove() : null
        p.frameRate(24)
        p.background(127)
        p.imageMode(p.CENTER);
        draw_allowed = true;
        const _URL = window.location.search


        const urlParams = new URLSearchParams(_URL);

        channel = urlParams.get('channel') ? urlParams.get('channel') : `channel000`

        if (p.windowWidth > p.windowHeight) {
            textSize = 24
            p.textSize(textSize)
        } else {
            textSize = 12
            p.textSize(textSize)
        }

        socket = io({
            transports: ['websocket']
        })
        socket.on('connect', () => {

        })
        socket.on('disconnect', () => {
            socket.removeAllListeners()
        })
        socket.on(channel,
            (data) => {
                if (bufferDeckData.length > (difficulty - 1)) {
                    bufferDeckData.shift()
                    bufferDeckImgs.shift()
                }
                p.loadImage(data.urls.thumb, _img => {
                    if (p.windowWidth > p.windowHeight) {
                        bufferDeckImgs.push(cropAndResizeImage(_img, gridSpaceX * 6, gridSpaceY * 6))
                    } else {
                        bufferDeckImgs.push(cropAndResizeImage(_img, gridSpaceX * 6, gridSpaceY * 6))
                    }
                    bufferDeckData.push(data)
                })
            }
        )

        elapsedTimesRegistered[0] = 0
        topDeck = new card(gridSpaceX * 3, gridSpaceY * 3)
        topDeck.initCards(p, cropAndResizeImage)

        bottomDeck = new card(gridSpaceX * 3, gridSpaceY * 18)
        bottomDeck.initCards(p, cropAndResizeImage)

        difficulty = INITIAL_DIFFICULTY
        encodeSendJWTRequestBuffer(difficulty, channel)

        someHeartBeatPeriod = 1000 * (getRandomNumber(minTime, minTime + ranTime));

        draw_allowed = true;
        p.background(10, 10, 10, 251)

        opDeckBtn = p.createButton('Deck [b]');
        opDeckBtn.position(25 * gridSpaceX, 28 * gridSpaceY);
        opDeckBtn.style('position', 'fixed')
        opDeckBtn.mousePressed(() => {
            if (gameStatus === `playing`) {
                shuffles++
                for (let index = 0; index < 6; index++) {
                    if (topDeck.imgs.length > 5) {
                        topDeck.imgs = []
                        topDeck.data = []
                    }
                    let rn = getRandomInt(bufferDeckImgs.length);
                    topDeck.imgs.push(bufferDeckImgs[rn])
                    topDeck.data.push(bufferDeckData[rn])
                    if (bottomDeck.imgs.length > 5) {
                        bottomDeck.imgs = []
                        bottomDeck.data = []

                    }
                    rn = getRandomInt(bufferDeckImgs.length);
                    bottomDeck.imgs.push(bufferDeckImgs[rn])
                    bottomDeck.data.push(bufferDeckData[rn])
                }
            }
        })
        console.log(`setup finished`)
        setupReady = true
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)



        opDeckBtn.position(14 * p.width / 16, 7 * p.height / 16);
        opDeckBtn.style('position', 'fixed')
        bottomDeck.initCardsLocations(p)
        topDeck.initCardsLocations(p)

        p.background(10, 10, 10, 251)
    }

    p.draw = async () => {
        if(!setupReady){
            console.log(`NOT DRAWING`)
            p.frameRate(1)
        }
        else {
        p.frameRate(24)
        
        p.background(10, 10, 10, 251)


        if (gameStatus === `ready`) {
            p.fill(200, 200, 15);
            p.text(`Ready? Press [Space Bar] or Tap to Start`, gridSpaceX * 7, gridSpaceY * 17, gridSpaceX*18, gridSpaceY*6)
            p.text(`How to Play: `, gridSpaceX * 7, gridSpaceY * 18, gridSpaceX*18, gridSpaceY*6)
            p.text(`Drag and Drop one image from the 6 bottom that matches one of the upper 6  `, gridSpaceX * 7, gridSpaceY * 19, gridSpaceX*18, gridSpaceY*6)
            opDeckBtn.hide()
        }

        if (gameStatus === `won`) {
            p.fill(200, 200, 200)

            p.text(`Time Left: ${((someHeartBeatPeriod - elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*4, textSize*6)
            p.text(`Min Time: ${(minTime).toFixed(2)}`, gridSpaceX*4, textSize*2)
            p.text(`Max Time: ${(ranTime + minTime).toFixed(2)}`, gridSpaceX*4, textSize*3)
            p.text(`Current Time: ${((someHeartBeatPeriod) / 1000).toFixed(2)}`, gridSpaceX*4, textSize*4)
            p.text(`Elapsed Time: ${((elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*4, textSize*5)
            
            p.fill(0, 200, 15);
            
            p.text(`Took you: ${((elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*18, textSize*3)
            p.fill(200, 20, 20)
            p.text(`Shuffles: ${(shuffles).toFixed(0)}`, gridSpaceX*18, textSize*2)

            p.fill(0, 200, 15);


            p.text(`Good Selection. Press [Space Bar] to continue...`, gridSpaceX * 7, gridSpaceY * 17, gridSpaceX*18, gridSpaceY*6)

            p.text(`Last time: ${((elapsedTimesRegistered[elapsedTimesRegistered.length - 1]) / 1000).toFixed(2)}`, gridSpaceX*25, gridSpaceY*3)
            p.text(`Difficulty: ${difficulty-1}`, gridSpaceX*25, gridSpaceY*5)
            p.text(`Lifes: ${lifes}`, gridSpaceX*25, gridSpaceY*7)
            p.text(`Points: ${(scores.reduce((partialSum, a) => partialSum + a, 0).toFixed(2))}`, gridSpaceX*25, gridSpaceY*9)

            p.fill(100, 100, 35);

            p.text(`Erned Points: ${(scores[scores.length - 1]).toFixed(4)}`, gridSpaceX * 7, gridSpaceY * 10, gridSpaceX*18, gridSpaceY*6)
            p.fill(0, 200, 15);

            p.text(`Difficulty Points: ${((difficulty - 1) * 1000).toFixed(4)}`, gridSpaceX * 7, gridSpaceY * 10 + textSize, gridSpaceX*18, gridSpaceY*6)
            p.text(`Time Points: ${((1000 / Math.floor(elapsedTime)*1000) ).toFixed(4)}`, gridSpaceX * 7, gridSpaceY * 10 + 2 * textSize, gridSpaceX*18, gridSpaceY*6)
            p.fill(200, 20, 15);
            p.text(`Shuffles Penalties: ${shuffles.toFixed(0)*10}`, gridSpaceX * 7, gridSpaceY * 10 + 3 * textSize, gridSpaceX*18, gridSpaceY*6)




            opDeckBtn.hide()
        }

        if (gameStatus === `lose`) {
            p.fill(200, 20, 15);
            p.text(`Game Over. Press [r] to restart the Game`, gridSpaceX * 7, gridSpaceY * 17, gridSpaceX*18, gridSpaceY*6)

            p.text(`Last time: ${((elapsedTimesRegistered[elapsedTimesRegistered.length - 1]) / 1000).toFixed(2)}`, gridSpaceX*25, gridSpaceY*3)
            p.text(`Difficulty: ${difficulty-1}`, gridSpaceX*25, gridSpaceY*5)
            p.text(`Lifes: ${lifes}`, gridSpaceX*25, gridSpaceY*7)
            p.text(`Points: ${(scores.reduce((partialSum, a) => partialSum + a, 0).toFixed(2))}`, gridSpaceX*25, gridSpaceY*9)

            opDeckBtn.hide()
        }

        if (gameStatus === `expired`) {
            p.fill(200, 20, 15);


            p.text(`Time expired, you spent a life. Now you have ${lifes} lifes. Press [space] to continue the Game`, gridSpaceX * 7, gridSpaceY * 17, gridSpaceX*18, gridSpaceY*6)

            p.text(`Last time: ${((elapsedTimesRegistered[elapsedTimesRegistered.length - 1]) / 1000).toFixed(2)}`, gridSpaceX*25, gridSpaceY*3)
            p.text(`Difficulty: ${difficulty-1}`, gridSpaceX*25, gridSpaceY*5)
            p.text(`Lifes: ${lifes}`, gridSpaceX*25, gridSpaceY*7)
            p.text(`Points: ${(scores.reduce((partialSum, a) => partialSum + a, 0).toFixed(2))}`, gridSpaceX*25, gridSpaceY*9)

            opDeckBtn.hide()
        }

        if (gameStatus === `playing`) {


            opDeckBtn.show()


            if (draw_allowed) {
                if (draw_1) {
                    bottomDeck.locationsX[imgDragged] = p.mouseX - t1;
                    bottomDeck.locationsY[imgDragged] = p.mouseY - t2;
                }
            }
            topDeck.show(p)
            bottomDeck.show(p)
            p.fill(0, 200, 15);
            p.text(`Last time: ${((elapsedTimesRegistered[elapsedTimesRegistered.length - 1]) / 1000).toFixed(2)}`, gridSpaceX*25, gridSpaceY*3)
            p.text(`Difficulty: ${difficulty}`, gridSpaceX*25, gridSpaceY*5)
            p.text(`Lifes: ${lifes}`, gridSpaceX*25, gridSpaceY*7)
            p.text(`Points: ${(scores.reduce((partialSum, a) => partialSum + a, 0).toFixed(2))}`, gridSpaceX*25, gridSpaceY*9)


            now = p.millis()
            elapsedTime = now - lastGeneratedTime
            let altura = p.map(elapsedTime, 0, someHeartBeatPeriod, 0, p.height)
            if (elapsedTime < someHeartBeatPeriod) {
                p.fill(tempcol)
                p.noStroke()
                p.rect(0, 0, gridSpaceX * 3, altura)
                p.fill(200, 200, 200)

                p.text(`Min Time: ${(minTime).toFixed(2)}`, gridSpaceX*4, textSize*2)
                p.text(`Max Time: ${(ranTime + minTime).toFixed(2)}`, gridSpaceX*4, textSize*3)
                p.text(`Current Time: ${((someHeartBeatPeriod) / 1000).toFixed(2)}`, gridSpaceX*4, textSize*4)
                p.text(`Elapsed Time: ${((elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*4, textSize*5)
                p.text(`Time Left: ${((someHeartBeatPeriod - elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*4, textSize*6)
                p.text(`Shuffles: ${(shuffles).toFixed(0)}`, gridSpaceX*18, textSize*2)



            }
            if (elapsedTime > someHeartBeatPeriod) {
                lastGeneratedTime = now
                shuffles = 0
                someHeartBeatPeriod = 1000 * (getRandomNumber(minTime, minTime + ranTime));

                tempcol = "#" + makeHexString(6)

                for (let index = 0; index < 6; index++) {
                    if (topDeck.imgs.length > 5) {
                        topDeck.imgs = []
                        topDeck.data = []
                        bottomDeck.imgs = []
                        bottomDeck.data = []

                    }

                    
                    let rn = getRandomInt(bufferDeckImgs.length);
                    bottomDeck.imgs.push(bufferDeckImgs[rn])
                    bottomDeck.data.push(bufferDeckData[rn])
                    rn = getRandomInt(bufferDeckImgs.length);
                    topDeck.imgs.push(bufferDeckImgs[rn])
                    topDeck.data.push(bufferDeckData[rn])
                }
                lifes = lifes - 1
                gameStatus = `expired`
                shuffles = 0
                if (lifes == 0) {
                    gameStatus = `lose`
                    encodeSendJWTRequestBuffer(difficulty, channel)
                }
                p.background(10, 10, 10, 251)
            }
        }
    }}

    p.doubleClicked = () => {
        if (gameStatus === `lose`) {
            gameStatus = `ready`
            difficulty = INITIAL_DIFFICULTY
            minTime = 12.0
            ranTime = 68.0
            shuffles = 0
            elapsedTimesRegistered = []
            elapsedTimesRegistered[0] = 0
            scores = []
            scores[0] = 0
            lifes = 3
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
        if (p.key === 'r') {
            if (gameStatus === `lose`) {
                gameStatus = `ready`
                difficulty = INITIAL_DIFFICULTY
                minTime = 12.0
                ranTime = 68.0
                shuffles = 0
                elapsedTimesRegistered = []
                elapsedTimesRegistered[0] = 0
                scores = []
                scores[0] = 0
                lifes = 3
            }


        }
        if (p.key === 's') {

        }
        if (p.key === 'b') {
            if (gameStatus === `playing`) {
                shuffles++
                for (let index = 0; index < 6; index++) {
                    if (topDeck.imgs.length > 5) {
                        topDeck.imgs = []
                        topDeck.data = []
                    }
                    let rn = getRandomInt(bufferDeckImgs.length);
                    topDeck.imgs.push(bufferDeckImgs[rn])
                    topDeck.data.push(bufferDeckData[rn])

                    if (bottomDeck.imgs.length > 5) {
                        bottomDeck.imgs = []
                        bottomDeck.data = []

                    }
                    let rn2 = getRandomInt(bufferDeckImgs.length);
                    bottomDeck.imgs.push(bufferDeckImgs[rn2])
                    bottomDeck.data.push(bufferDeckData[rn2])
                }
            }
        }
        if (p.key === 'm') {












        }
        if (p.key === 'B') {



        }
        if (p.key === 'X') {

        }
        if (p.key === 'N') {

        }
        if (p.key === ' ') {
            if (gameStatus === `ready` || gameStatus === `won` || gameStatus === `expired`) {
                shuffles = 0
                bottomDeck.initCardsLocations(p)
                gameStatus = `playing`

                elapsedTime = 0
                lastGeneratedTime = p.millis()
                someHeartBeatPeriod = 1000 * (getRandomNumber(minTime, minTime + ranTime));

                tempcol = "#" + makeHexString(6)

                for (let index = 0; index < 6; index++) {
                    if (topDeck.imgs.length > 5) {
                        topDeck.imgs = []
                        topDeck.data = []
                        bottomDeck.imgs = []
                        bottomDeck.data = []

                    }
                    let rn = getRandomInt(bufferDeckImgs.length);
                    bottomDeck.imgs.push(bufferDeckImgs[rn])
                    bottomDeck.data.push(bufferDeckData[rn])

                    rn = getRandomInt(bufferDeckImgs.length);
                    topDeck.imgs.push(bufferDeckImgs[rn])
                    topDeck.data.push(bufferDeckData[rn])
                }
                verifyWon = false
            }
        }
    }

    p.mousePressed = async () => {
        if (gameStatus === `ready` || gameStatus === `won` || gameStatus === `expired`) {
            shuffles = 0
            bottomDeck.initCardsLocations(p)
            gameStatus = `playing`

            elapsedTime = 0
            lastGeneratedTime = p.millis()
            someHeartBeatPeriod = 1000 * (getRandomNumber(minTime, minTime + ranTime));

            tempcol = "#" + makeHexString(6)

            for (let index = 0; index < 6; index++) {
                if (topDeck.imgs.length > 5) {
                    topDeck.imgs = []
                    topDeck.data = []
                    bottomDeck.imgs = []
                    bottomDeck.data = []

                }

                
                let rn = getRandomInt(bufferDeckImgs.length);
                bottomDeck.imgs.push(bufferDeckImgs[rn])
                bottomDeck.data.push(bufferDeckData[rn])

                rn = getRandomInt(bufferDeckImgs.length);
                topDeck.imgs.push(bufferDeckImgs[rn])
                topDeck.data.push(bufferDeckData[rn])
            }
            verifyWon = false
        }
        if (gameStatus === `playing`) {
            for (let idx = 0; idx < bottomDeck.imgs.length; idx++) {
                if (await bottomDeck.checkPressed(p, idx)) {

                    draw_allowed = true;
                    imgDragged = idx
                    t1 = p.map(p.mouseX - (bottomDeck.locationsX[idx] - bottomDeck.imgs[idx].width / 2), 0, bottomDeck.imgs[idx].width, -bottomDeck.imgs[idx].width / 2, bottomDeck.imgs[idx].width / 2)
                    t2 = p.map(p.mouseY - (bottomDeck.locationsY[idx] - bottomDeck.imgs[idx].height / 2), 0, bottomDeck.imgs[idx].height, -bottomDeck.imgs[idx].height / 2, bottomDeck.imgs[idx].height / 2)
                    d1 = 0;
                }
            }
        }
    }

    p.mouseReleased = async () => {
        draw_allowed = false;
        draw_1 = false;
        for (let idx = 0; idx < topDeck.imgs.length; idx++) {
            if (await bottomDeck.checkOver(p, imgDragged, topDeck, idx)) {
                if (imgDragged === undefined) return
                console.log(`my card ${imgDragged} is over card ${idx}`)
                let thisImgData = bottomDeck.data[imgDragged]
                console.log(`It took you ${elapsedTime / 1000} s to complete`)
                p.background(10, 10, 10, 251)
                if (thisImgData.id === topDeck.data[idx].id && !verifyWon) {
                    verifyWon = true

                    elapsedTimesRegistered.push(elapsedTime)

                    // Score = 1000 * difficulty + 100 * (1/time-to-match) - 10 * Number-of-shuffles
                    const lastScore = (difficulty * 1000) + (1000 / Math.floor(elapsedTime))*1000 - (10 * shuffles)
                    console.log("lastScore: ***** ", lastScore)
                    scores.push(lastScore)

                    bottomDeck.locationsX[imgDragged] = topDeck.locationsX[idx]
                    bottomDeck.locationsY[imgDragged] = topDeck.locationsY[idx]
                    gameStatus = `won`
                    difficulty++
                    encodeSendJWTRequestBuffer(difficulty, channel)
                    ranTime -= 1
                    minTime -= bleedRate
                    if (ranTime < 12.0) {
                        ranTime = 12.0
                    }
                    if (minTime < 4.0) {
                        minTime = 4.0
                    }

                    p.background(10, 10, 10, 251)
                    imgDragged = undefined

                } else if (!verifyWon) {
                    bottomDeck.initCardsLocations(p)
                    imgDragged === undefined
                }

            } else {
                bottomDeck.initCardsLocations(p)
                imgDragged === undefined
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