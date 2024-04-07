import screenshot from 'screenshot-desktop'
import { crop } from 'easyimage'
import {mouse, Button, Point, sleep, screen, imageResource} from '@nut-tree/nut-js'
import Jimp from 'jimp'
import cv from '@u4/opencv4nodejs'
const { imread, imshow, waitKey, TM_CCOEFF_NORMED, minMaxLoc } = cv;

async function calculateFillPercentage(imagePath) {
  const image = await Jimp.read(imagePath);
  const height = image.bitmap.height;
  const width = image.bitmap.width;

  let filledPixels = 0;

  // Loop through each column to find the first non-filled pixel.
  for (let x = 0; x < width; x++) {
    // Sample a pixel from the middle of the height, assuming the bar fills evenly.
    const pixelColor = image.getPixelColor(x, height / 2);

    // Convert the color to a Jimp object to extract RGBA values.
    const { r, g, b, a } = Jimp.intToRGBA(pixelColor);
    // Assuming that the filled color is pink and the unfilled part is dark blue,
    // we need to define the RGB color range that represents the pink fill.
    // These values would need to be determined by analyzing the actual color.
    // For example, let's assume pink has a high red value, medium green value, and low blue value.
    if ((r > 100 && g < 150 && b > 100)) filledPixels++;
    else break
  }

  // Calculate the fill percentage.
  const fillPercentage = (filledPixels / width) * 100;
  
  return fillPercentage.toFixed(2);
}


export async function PlayCard(card = 1, square) {
	// Cards are in the following x coordinates for my screen:
	// Card 1: 830
	// Card 2: 920
	// Card 3: 1010
	// Card 4: 1100
	// Since default is card 1, we just remove 90 from 830, to always get one of the cards
	
	
	const point = new Point(740 + 90 * card, 1000)
	await mouse.move(point)
	await mouse.click(Button.LEFT)
	
	
	// 700 790
	// each square is 25*25 pixels in my screen I think?
	let x = 700, y = 790
	const letter = square[0]
	const number = parseInt(square[1], 10);
	// Converts A to 0, B to 1, etc
	const xOffset = (letter.charCodeAt(0) - 'A'.charCodeAt(0)) * 25;
	const yOffset = (-number + 1) * 25
	x += xOffset
	y += yOffset

	await mouse.move(new Point(x, y))
	await mouse.click(Button.LEFT)
}

function loadCardTemplates() {
	const templates = {}
	const cardNames = [ 'blue_barrel', 'blue_electrowz', 'blue_fireball', 'blue_horde', 'blue_knight', 'blue_log', 'blue_prince', 'blue_zap' ] 
	cardNames.forEach(name => templates[ name ] = imread(`./cardTemplates/${name}.jpg`))
	return templates
}

const templates = loadCardTemplates()
export async function getCards() {
	await screenshot({filename: 'cardsScreenshot.jpg'})
	console.log('Took cards screenshot')
	const elixirInfo = await crop({
		x: 802,
		y: 1065,
		cropHeight: 14,
		cropWidth: 340,
		src: 'cardsScreenshot.jpg'
	})
	
	console.log('Resized elixir ss')
	const cardsInfo = await crop({
		x: 802,
		y: 1000,
		cropHeight: 14,
		cropWidth: 340,
		src: 'cardsScreenshot.jpg'
	})
	const elixirPath = elixirInfo.path // C:/Users/<User>/AppData/Local/Temp/
	const cardsPath = cardsInfo.path
	const cardsImage = imread(cardsPath)
	const foundCards = []


	Object.keys(templates).forEach(cardName => {
		const template = templates[ cardName ];
		const result = cardsImage.matchTemplate(template, TM_CCOEFF_NORMED)

		const { maxVal, maxLoc } = minMaxLoc(result)

		if (maxVal > 0.8) { // Threshold for a match, might need tuning
			// If a card is found, draw a rectangle around it (optional, for visualization)
			cardsImage.drawRectangle(maxLoc, new cv.Point(maxLoc.x + template.cols, maxLoc.y + template.rows), new cv.Vec(255, 0, 0), 2)
			foundCards.push(cardName)
		}
	})

	const elixir = await calculateFillPercentage(elixirPath)
	return {
		elixir,
		foundCards
	}
}
