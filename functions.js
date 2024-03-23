import screenshot from 'screenshot-desktop'
import { crop } from 'easyimage'
import {mouse, Button, Point, sleep, screen, imageResource} from '@nut-tree/nut-js'
import Jimp from 'jimp'


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


export async function getCards(name) {
	
	await screenshot({filename: 'screenshot.jpg'})
	console.log('Took screenshot')
	const elixirInfo = await crop({
		x: 802,
		y: 1065,
		cropHeight: 14,
		cropWidth: 340,
		src: 'screenshot.jpg'
	})
	
	console.log('Resized elixir ss')
	const cardsInfo = await crop({
		x: 802,
		y: 1000,
		cropHeight: 14,
		cropWidth: 340,
		src: 'screenshot.jpg'
	})
	const elixirPath = elixirInfo.path // C:/Users/<User>/AppData/Local/Temp/
	const cardsPath = cardsInfo.path

	const elixir = await calculateFillPercentage(elixirPath)
	
	return {
		elixir,
		foundCards
	}
}
