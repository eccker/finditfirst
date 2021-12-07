let sha256 = (ascii) => {
    let rightRotate = (value, amount) => {
        return (value>>>amount) | (value<<(32 - amount))
    }
    
    let mathPow = Math.pow
    let maxWord = mathPow(2, 32)
    let lengthProperty = 'length'
    let i, j
    let result = ''
    let words = []
    let asciiBitLength = ascii[lengthProperty]*8
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    let hash = sha256.h = sha256.h || []
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    let k = sha256.k = sha256.k || []
    let primeCounter = k[lengthProperty]
    /*/
    let hash = [], k = [];
    let primeCounter = 0;
    //*/
    let isComposite = {}
    for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0
        }
    }
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i)
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0)
    words[words[lengthProperty]] = (asciiBitLength)
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        let w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        let oldHash = hash
        // This is now the undefinedworking hash", often labelled as letiables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8)
        for (i = 0; i < 64; i++) {
            let i2 = i + j
            // Expand the message into 64 words
            // Used below if 
            let w15 = w[i - 15], w2 = w[i - 2]
            // Iterate
            let a = hash[0], e = hash[4]
            let temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                )
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            let temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])) // maj   
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0
        }   
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0
        }
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            let b = (hash[i]>>(j*8))&255
            result += ((b < 16) ? 0 : '') + b.toString(16)
        }
    }
    return result
}

let writeCookie = (cookieName, value, days) => {
    let date, expires
    if (days) {
        date = new Date()
        date.setTime(date.getTime()+(days*24*60*60*1000))
        expires = "; expires="+date.toGMTString()
    } else {
        expires = ""
    }
    document.cookie = cookieName + "=" + window.btoa(value) + expires + "; path=/";
}

let makeSecret = (length) => {
    let result           =  ``
    let characters       = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`  
    let charactersLength = characters.length
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
let getJSON = (url, callback) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'text'
    xhr.onload = () => {
        var status = xhr.status
        if (status == 200) {
            callback(null, xhr.response)
        } else {
            callback(status)
        }
    }
    xhr.send()
}

window.onunload = () => {
    socket.removeAllListeners()
    return
}

let getCookie = (cookieName) => {
    let dc = document.cookie
    let prefix = cookieName + "="
    let begin = dc.indexOf("; " + prefix)
    let end
    if (begin == -1) 
        {
            begin = dc.indexOf(prefix)
            if (begin != 0) return null
        }
    else
        {
            begin += 2
            end = document.cookie.indexOf(";", begin)
            if (end == -1) {
            end = dc.length
            }
        }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end))
} 

let uJWT
window.history.forward()
let noBack = () => { window.history.forward() }
const cookieNameApp = `finditfirstapp`
let hashedpassword

let loadAfterOnload = async () => {
    let userCookie = await getCookie(cookieNameApp)
    userCookie === null?uJWT = 0:uJWT = 1
    // Generate a RHUID and store it on localstorage
    let script = document.createElement('script')
    script.onload = () => {
        if (uJWT === 0) {
            let oHeader = { alg: 'HS256', typ: 'JWT' }
            let oPayload = {
                    "user": {
                        "id": `${makeSecret(32)}`,
                        "name": `${makeSecret(32)}`,
                        "nounce": `${makeSecret(32)}`,
                    },
                    "credentials":{
                        "username":`${makeSecret(32)}`, // TODO obtain this from user
                        "hashedpassword":`${sha256(makeSecret(32))}` // TODO obtain this from user
                    }
            }
            hashedpassword = oPayload.credentials.hashedpassword
            window.localStorage.setItem('hashedpassword', hashedpassword)
            let sHeader = JSON.stringify(oHeader)
            let sPayload = JSON.stringify(oPayload)
            // TODO this must be requested as an API request
            let randomKey = makeSecret(32)
            let preuserJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, randomKey)
            getJSON(`/token/${preuserJWT}/${randomKey}`,  (err, data) => {
                if (err != null) {
                    console.error(err)
                } else {
                    window.localStorage.setItem('userJWT', data)
                    writeCookie(cookieNameApp, data, 1)
                    let userJWT = window.localStorage.getItem('userJWT')
                    getJSON(`/auth/${userJWT}/${hashedpassword}`,  (err, data) => {
                        if (err != null) {
                            console.error(err)
                        } else {
                            console.log(data)
                            new p5(sketch)
                        }
                    })
                }
            })
        } else {
            let userJWT = window.localStorage.getItem('userJWT')
            hashedpassword = window.localStorage.getItem('hashedpassword')
            getJSON(`/auth/${userJWT}/${hashedpassword}`,  (err, data) => {
                    if (err != null) {
                        console.error(err)
                    } else {
                        console.log(data)
                        new p5(sketch)
                    }
                })
        }
    }
    script.src= '/js/jsrsasign-latest-all-min.js'
    document.head.appendChild(script)
}