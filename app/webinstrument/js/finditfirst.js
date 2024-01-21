let sketch = (p) => {
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

    let micarta
    let cartaopuesta
    let bufferDeckData = []
    let bufferDeckImgs = []

    let difficulty = 16
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
                "channel": channel
            }
        }
        let sHeader = JSON.stringify(oHeader)
        let sPayload = JSON.stringify(oPayload)
        let signedCommands = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, currentJWT)
        socket.emit(`server`, signedCommands + `;` + currentJWT)
    }

    let encodeSendJWTRequestBuffer = (buffLength = 16) => {

        let currentJWT = window.localStorage.getItem('userJWT')
        let oHeader = {
            alg: 'HS256',
            typ: 'JWT'
        }

        let oPayload = {
            "user": {
                "buffer": buffLength,
                "channel": channel,
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

    p.preload = () => {
        gridSpaceX = p.windowWidth / 32
        gridSpaceY = p.windowHeight / 32


    }

    p.setup = () => {
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

            p.textSize(24)
        } else {

            p.textSize(12)
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
        cartaopuesta = new card(gridSpaceX * 3, gridSpaceY * 3)
        cartaopuesta.initCards(p, cropAndResizeImage)

        micarta = new card(gridSpaceX * 3, gridSpaceY * 18)
        micarta.initCards(p, cropAndResizeImage)

        difficulty = 2
        encodeSendJWTRequestBuffer(difficulty)

        someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * ranTime) + minTime)
        draw_allowed = true;
        p.background(10, 10, 10, 251)

        opDeckBtn = p.createButton('Deck [b]');
        opDeckBtn.position(25 * gridSpaceX, 28 * gridSpaceY);
        opDeckBtn.style('position', 'fixed')
        opDeckBtn.mousePressed(() => {
            if (gameStatus === `playing`) {
                shuffles++
                for (let index = 0; index < 6; index++) {
                    if (cartaopuesta.imgs.length > 5) {
                        cartaopuesta.imgs = []
                        cartaopuesta.data = []
                    }
                    let rn = Math.floor(Math.random() * bufferDeckImgs.length)
                    cartaopuesta.imgs.push(bufferDeckImgs[rn])
                    cartaopuesta.data.push(bufferDeckData[rn])
                    if (micarta.imgs.length > 5) {
                        micarta.imgs = []
                        micarta.data = []

                    }
                    rn = Math.floor(Math.random() * bufferDeckImgs.length)
                    micarta.imgs.push(bufferDeckImgs[rn])
                    micarta.data.push(bufferDeckData[rn])
                }
            }
        })

    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)



        opDeckBtn.position(14 * p.width / 16, 7 * p.height / 16);
        opDeckBtn.style('position', 'fixed')
        micarta.initCardsLocations(p)
        cartaopuesta.initCardsLocations(p)

        p.background(10, 10, 10, 251)
    }

    p.draw = () => {
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

            p.text(`Time Left: ${((someHeartBeatPeriod - elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*4, 12)
            p.text(`Min Time: ${(minTime).toFixed(2)}`, gridSpaceX*4, 12*2)
            p.text(`Max Time: ${(ranTime + minTime).toFixed(2)}`, gridSpaceX*4, 12*3)
            p.text(`Current Time: ${((someHeartBeatPeriod) / 1000).toFixed(2)}`, gridSpaceX*4, 12*4)
            p.text(`Elapsed Time: ${((elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*4, 12*5)
            
            
            p.fill(0, 200, 15);
            
            p.text(`Took you: ${((elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*18, 12*3)
            p.fill(200, 20, 20)
            p.text(`Shuffles: ${(shuffles).toFixed(0)}`, gridSpaceX*18, 12*2)
            

            p.fill(0, 200, 15);


            p.text(`Good Selection. Press [Space Bar] to continue...`, gridSpaceX * 7, gridSpaceY * 17, gridSpaceX*18, gridSpaceY*6)

            p.text(`Last time: ${((elapsedTimesRegistered[elapsedTimesRegistered.length - 1]) / 1000).toFixed(2)}`, gridSpaceX*25, gridSpaceY*3)
            p.text(`Difficulty: ${difficulty-1}`, gridSpaceX*25, gridSpaceY*5)
            p.text(`Lifes: ${lifes}`, gridSpaceX*25, gridSpaceY*7)
            p.text(`Points: ${(scores.reduce((partialSum, a) => partialSum + a, 0).toFixed(2))}`, gridSpaceX*25, gridSpaceY*9)

            p.fill(100, 100, 35);

            p.text(`Erned Points: ${(scores[scores.length - 1]).toFixed(4)}`, gridSpaceX * 7, gridSpaceY * 10, gridSpaceX*18, gridSpaceY*6)
            p.fill(0, 200, 15);

            p.text(`Difficulty Points: ${((difficulty - 1) * 10).toFixed(4)}`, gridSpaceX * 7, gridSpaceY * 11, gridSpaceX*18, gridSpaceY*6)
            p.text(`Time Points: ${((500 / Math.floor(elapsedTime)) * 100).toFixed(4)}`, gridSpaceX * 7, gridSpaceY * 12, gridSpaceX*18, gridSpaceY*6)
            p.fill(200, 20, 15);
            p.text(`Shuffles Penalties: ${shuffles.toFixed(0)}`, gridSpaceX * 7, gridSpaceY * 13, gridSpaceX*18, gridSpaceY*6)




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


            p.text(`Time expired, you spent a ticket. Now you have ${lifes} tickets. Press [space] to continue the Game`, gridSpaceX * 7, gridSpaceY * 17, gridSpaceX*18, gridSpaceY*6)

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
                    micarta.locationsX[imgDragged] = p.mouseX - t1;
                    micarta.locationsY[imgDragged] = p.mouseY - t2;
                }
            }
            cartaopuesta.show(p)
            micarta.show(p)
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

                p.text(`Time Left: ${((someHeartBeatPeriod - elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*4, 12)
                p.text(`Min Time: ${(minTime).toFixed(2)}`, gridSpaceX*4, 12*2)
                p.text(`Max Time: ${(ranTime + minTime).toFixed(2)}`, gridSpaceX*4, 12*3)
                p.text(`Current Time: ${((someHeartBeatPeriod) / 1000).toFixed(2)}`, gridSpaceX*4, 12*4)
                p.text(`Elapsed Time: ${((elapsedTime) / 1000).toFixed(2)}`, gridSpaceX*4, 12*5)
                p.text(`Shuffles: ${(shuffles).toFixed(0)}`, gridSpaceX*18, 12*2)



            }
            if (elapsedTime > someHeartBeatPeriod) {
                lastGeneratedTime = now
                shuffles = 0
                someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * ranTime) + minTime)
                tempcol = "#" + makeHexString(6)


                for (let index = 0; index < 6; index++) {
                    if (cartaopuesta.imgs.length > 5) {
                        cartaopuesta.imgs = []
                        cartaopuesta.data = []
                        micarta.imgs = []
                        micarta.data = []

                    }

                    let rn = Math.floor(Math.random() * bufferDeckImgs.length)
                    micarta.imgs.push(bufferDeckImgs[rn])
                    micarta.data.push(bufferDeckData[rn])
                    rn = Math.floor(Math.random() * bufferDeckImgs.length)
                    cartaopuesta.imgs.push(bufferDeckImgs[rn])
                    cartaopuesta.data.push(bufferDeckData[rn])
                }
                lifes = lifes - 1
                gameStatus = `expired`
                shuffles = 0
                if (lifes == 0) {
                    gameStatus = `lose`
                    encodeSendJWTRequestBuffer(difficulty)
                }


                p.background(10, 10, 10, 251)
            }
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
                difficulty = 2
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
                    if (cartaopuesta.imgs.length > 5) {
                        cartaopuesta.imgs = []
                        cartaopuesta.data = []
                    }
                    let rn = Math.floor(Math.random() * bufferDeckImgs.length)
                    cartaopuesta.imgs.push(bufferDeckImgs[rn])
                    cartaopuesta.data.push(bufferDeckData[rn])

                    if (micarta.imgs.length > 5) {
                        micarta.imgs = []
                        micarta.data = []

                    }
                    let rn2 = Math.floor(Math.random() * bufferDeckImgs.length)
                    micarta.imgs.push(bufferDeckImgs[rn2])
                    micarta.data.push(bufferDeckData[rn2])
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
                micarta.initCardsLocations(p)
                gameStatus = `playing`

                elapsedTime = 0
                lastGeneratedTime = p.millis()
                someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * ranTime) + minTime)
                tempcol = "#" + makeHexString(6)

                for (let index = 0; index < 6; index++) {
                    if (cartaopuesta.imgs.length > 5) {
                        cartaopuesta.imgs = []
                        cartaopuesta.data = []
                        micarta.imgs = []
                        micarta.data = []

                    }

                    let rn = Math.floor(Math.random() * bufferDeckImgs.length)
                    micarta.imgs.push(bufferDeckImgs[rn])
                    micarta.data.push(bufferDeckData[rn])

                    rn = Math.floor(Math.random() * bufferDeckImgs.length)
                    cartaopuesta.imgs.push(bufferDeckImgs[rn])
                    cartaopuesta.data.push(bufferDeckData[rn])
                }
                verifyWon = false
            }
        }
    }
    p.mousePressed = async () => {
        if (gameStatus === `ready` || gameStatus === `won` || gameStatus === `expired`) {
            shuffles = 0
            micarta.initCardsLocations(p)
            gameStatus = `playing`

            elapsedTime = 0
            lastGeneratedTime = p.millis()
            someHeartBeatPeriod = 1000 * (Math.floor(Math.random() * ranTime) + minTime)
            tempcol = "#" + makeHexString(6)

            for (let index = 0; index < 6; index++) {
                if (cartaopuesta.imgs.length > 5) {
                    cartaopuesta.imgs = []
                    cartaopuesta.data = []
                    micarta.imgs = []
                    micarta.data = []

                }

                let rn = Math.floor(Math.random() * bufferDeckImgs.length)
                micarta.imgs.push(bufferDeckImgs[rn])
                micarta.data.push(bufferDeckData[rn])

                rn = Math.floor(Math.random() * bufferDeckImgs.length)
                cartaopuesta.imgs.push(bufferDeckImgs[rn])
                cartaopuesta.data.push(bufferDeckData[rn])
            }
            verifyWon = false
        }
        if (gameStatus === `playing`) {
            for (let idx = 0; idx < micarta.imgs.length; idx++) {
                if (await micarta.checkPressed(p, idx)) {

                    draw_allowed = true;
                    imgDragged = idx
                    t1 = p.map(p.mouseX - (micarta.locationsX[idx] - micarta.imgs[idx].width / 2), 0, micarta.imgs[idx].width, -micarta.imgs[idx].width / 2, micarta.imgs[idx].width / 2)
                    t2 = p.map(p.mouseY - (micarta.locationsY[idx] - micarta.imgs[idx].height / 2), 0, micarta.imgs[idx].height, -micarta.imgs[idx].height / 2, micarta.imgs[idx].height / 2)
                    d1 = 0;
                }
            }
        }
    }

    p.mouseReleased = async () => {
        draw_allowed = false;
        draw_1 = false;
        for (let idx = 0; idx < cartaopuesta.imgs.length; idx++) {
            if (await micarta.checkOver(p, imgDragged, cartaopuesta, idx)) {
                if (imgDragged === undefined) return
                console.log(`my card ${imgDragged} is over card ${idx}`)
                let thisImgData = micarta.data[imgDragged]
                console.log(`It took you ${elapsedTime / 1000} s to complete`)
                p.background(10, 10, 10, 251)
                if (thisImgData.id === cartaopuesta.data[idx].id && !verifyWon) {
                    verifyWon = true

                    elapsedTimesRegistered.push(elapsedTime)
                    scores.push((difficulty * 10) + ((500 / Math.floor(elapsedTime)) * 100) - (shuffles))







                    micarta.locationsX[imgDragged] = cartaopuesta.locationsX[idx]
                    micarta.locationsY[imgDragged] = cartaopuesta.locationsY[idx]
                    gameStatus = `won`
                    difficulty++
                    encodeSendJWTRequestBuffer(difficulty)
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






                    micarta.initCardsLocations(p)
                    imgDragged === undefined
                }

            } else {
                micarta.initCardsLocations(p)
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