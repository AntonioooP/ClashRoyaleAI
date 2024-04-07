import screenshot from 'screenshot-desktop'
import { crop } from 'easyimage'
import fs from 'fs'
import net from 'net'
import { PlayCard, getCards } from './functions.js'
import cardsStats from './cardsStats.json' assert { type: 'json' }

async function takeSS(name) {
    await screenshot({ filename: 'screenshot.jpg' })
    console.log('Took screenshot')

    const imgInfo = await crop({
        x: 690,
        y: 210,
        cropHeight: 600,
        cropWidth: 460,
        src: 'screenshot.jpg'
    })
    console.log('Resized screenshot')
    const path = imgInfo.path
    const data = fs.readFileSync(path)
    fs.writeFileSync('images/output.jpg', data)
    return './images/output.jpg'
}


const fieldArray = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], // 18 spaces of width
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    // This is the middle, the bridge between blue and red areas
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
]



const client = new net.Socket()


async function runInference() {
    const imgPath = await takeSS()

    client.write(imgPath)
}

async function Play(results) {
    const cards = []
    // Decide what to do:
    // One idea is to add to the fieldArray a numeric representation of each card that is played, but where in the array to place it?

    const get = await getCards()
    get.cards = get.foundCards
    const elixir = get.elixir
    results.forEach(result => cards.push({ card: result.label.replace(/:.*/, ''), coordinates: result.coordinates }))
    
    // Board is empty determine if we should wait or play something.
    
  
    if (elixir >= 5) {
        // More aggressive or strategic play
        if (opponentPlayedAThreat(cards)) {
            // Respond to threat if necessary

            const counter = findCounterToThreat(cards, get.cards)
            const cardInt = get.cards[ counter.card ] + 1 || 1
            console.log('opponent played a threat so playing ' + counter.card + ' ' + counter.position)
            if (counter) return PlayCard(cardInt, counter.position)
            
        } else {
            // No immediate threat, consider setting up a push or controlling the board
            const setupCard = findSetupCard(get.cards)
            const cardInt = get.cards[ setupCard.card ] + 1 || 1
            console.log('setting up attack ' + setupCard.card + ' ' + setupCard.position)
            if (setupCard) return PlayCard(cardInt, setupCard.position)
        }
    } else if (elixir < 3) {
        // Defensive or saving elixir for a full bar
        if (immediateDefenseRequired(cards)) {
            const defenseCard = findCounterToThreat(cards, get.cards)
            const cardInt = get.cards[ defenseCard.card ] + 1 || 1
            console.log('immediate defense required: ' + defenseCard.card + ' ' + defenseCard.position)
            if (defenseCard) return PlayCard(cardInt, defenseCard.position)
        } else console.log('waiting for elixir')
    } else console.log('waiting for elixir')

}

function opponentPlayedAThreat(cards) { 
    if (cards.includes('blue_prince') || cards.includes('blue_knight')) return false
    if (cards.some(x => ['megaknight', 'royalghost', 'bandit'].includes(x.label))) return true
    return false
}
function findCounterToThreat(cards, availableCards) {
    const counter = {}
    cards.forEach(({label}) => {
        if (label.startsWith('blue')) return
        if (label == 'megaknight') {
            if (availableCards.includes('blue_prince')) {
                counter.card = 'blue_prince'
                counter.position = 'B5'
            } else {
                counter.card = availableCards[ 0 ]
                counter.position = 'B7'
            }
        } else if (label == 'bandit') {
            if (availableCards.includes('blue_knight')) {
                counter.card = 'blue_knight'
                counter.position = 'B5'
            } else {
                counter.card = availableCards[ 0 ]
                counter.position = 'B7'
            }
        } else {
            counter.card = availableCards[ 0 ]
            counter.position = 'B7'
        }

    })
    return counter
}

function findSetupCard(availableCards) {
    if (availableCards.includes('blue_prince')) {
        return {card: 'blue_prince', position: 'B6'}
    } else if (availableCards.includes('blue_barrel')) return { card: 'blue_goblin', position: 'B14' }
    return {card: 'any', position: 'B14'}
}
function immediateDefenseRequired(cards) {
    return cards.some(card => {
        const midpointY = (card[ 1 ] + card[ 3 ]) / 2
        if (midpointY <= 200) return true
        return false
    })
}

client.connect(65432, '127.0.0.1', function () {
    console.log('Connected')
    runInference()
})
client.on('data', async (data) => {
    // Parse the received data as JSON
    let results = JSON.parse(data)
    console.log(results)

    await runInference()
    await Play(results)
})

client.on('close',  () => {
    console.log('Connection closed')
})

client.on('error', (err) => {
    console.error(`Connection error: ${err}`)
})