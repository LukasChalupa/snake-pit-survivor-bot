// import puppeteer from 'puppeteer'

import { getBoardData } from "./getBoardData.js"
import { getNextMove } from "./getNextMove.js"
import { getPlayerToken } from "./getPlayerToken.js"

export const FREE_SPACE_CODE = " "
export const WALL_CODE = "X"
export const FOOD_CODE = "O"

const createRoom = async () => {
	const createRoomResponse = await fetch(
		"https://snake-pit.onrender.com/create-room",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				width: 10,
				height: 10,
				maximumPlayers: 1,
				maximumFood: 10,
			}),
		}
	)
	if (!createRoomResponse.ok) {
		throw new Error("invalid list rooms response")
	}

	const { room } = await createRoomResponse.json()
	return room
}

const getRoom = async () => {
	const listRoomsResponse = await fetch(
		"https://snake-pit.onrender.com/list-rooms"
	)
	if (!listRoomsResponse.ok) {
		throw new Error("invalid list rooms response")
	}

	const { rooms } = await listRoomsResponse.json()
	return rooms.find(
		(room) =>
			room.status === "waiting" &&
			room.joinedPlayers.length === room.maximumPlayers - 1
	)
}

const run = async () => {
	const playerToken = await getPlayerToken()

	// Find room to join
	// const room = await getRoom()
	const room = await createRoom()

	if (!room) {
		console.log("No rooms available")
		return
	}
	console.log(
		"Joining room",
		`https://snake-pit.onrender.com/room/?id=${room.id}`
	)

	// const browser = await puppeteer.launch({executablePath: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe'})
	// const page = await browser.newPage()
	// await page.goto(`https://snake-pit.onrender.com/room/?id=${room.id}`)

	let action = "forward"

	// Keep going forward
	while (true) {
		const payload = {
			playerToken,
			action,
		}
		// console.log("Sending action", action)
		// console.log("-----------------------")
		await new Promise((resolve) => setTimeout(resolve, 100))
		const actionResponse = await fetch(
			`https://snake-pit.onrender.com/room/${room.id}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		)

		const actionData = await actionResponse.json()

		if (!actionData.room) {
			throw new Error("invalid action response")
		}

		const board = getBoardData(actionData)
		const me = actionData.room.players.find(
			(player) => player.id === actionData.yourPlayerId
		)
		action = getNextMove(me, board)
		if (actionData.room.status === "ended") {
			return
		}
	}
}

run()
