const video = document.getElementById('video')
const message = document.getElementById('message')
const output = document.getElementById('output')
const characters = " .:-=+*#%@"

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })

let cols = 120
let rows = 0

video.addEventListener('loadedmetadata', () => {
    setupGrid()
    console.log(`Vidéo ${video.videoWidth}x${video.videoHeight} → grille ${cols}x${rows}`)
    requestAnimationFrame(loop)   // démarre la boucle
})

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        video.srcObject = stream
    } catch (error) {
        message.textContent = error.message
    }
}

function setupGrid() {
    rows = Math.round(cols * (video.videoHeight / video.videoWidth) * 0.5)
    canvas.width = cols
    canvas.height = rows
}

function frametoascii() {
    ctx.drawImage(video, 0, 0, cols, rows)
    const imageData = ctx.getImageData(0, 0, cols, rows).data
    const lines = []

    for (let y = 0; y < rows; y++) {
        const line = []
        for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4
            const R = imageData[i]
            const G = imageData[i + 1]
            const B = imageData[i + 2]
            const lum = 0.299 * R + 0.587 * G + 0.114 * B
            const index = Math.floor(lum / 256 * characters.length)
            line.push(characters[index])
        }
        lines.push(line.join(''))
    }
    return lines.join('\n')
}

function loop(now) {
    output.textContent = frametoascii()
    requestAnimationFrame(loop)           
}

startCamera()