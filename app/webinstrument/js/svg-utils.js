let finditfirstElement
	let finditfirstPath

	let fraseDiv
	let noiseScale = 0.02

	let xoff = 1.0
	let finditfirstPoints3DArray
	let finditfirstCommands
	
    
let generateDistortedfinditfirstInDOM = (_distortion, _SVGPoints3DArray, _finditfirstCommands, SVGDOMElement) => {
    let finditfirstModifiedPathArray = modifyShapeByDistortion(_distortion, _SVGPoints3DArray)
    let finditfirstModifiedPathString = convert3DArrayToDPathString(finditfirstModifiedPathArray, _finditfirstCommands)
    SVGDOMElement.setAttribute('d', finditfirstModifiedPathString)
    document.getElementById('finditfirst_svg').setAttribute('width', p.width)
    document.getElementById('finditfirst_svg').setAttribute('height', p.height)
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

