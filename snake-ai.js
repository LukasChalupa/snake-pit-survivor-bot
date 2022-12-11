// import puppeteer from 'puppeteer'

import { getBoardData } from "./getBoardData.js"
import { getNextMove } from "./getNextMove.js"

export const FREE_SPACE_CODE = 1
export const WALL_CODE = 2
export const FOOD_CODE = 3

const createRoom = async () => {
	const createRoomResponse = await fetch(
		"https://snake-pit.onrender.com/create-room",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				width: 5,
				height: 5,
				maximumPlayers: 1,
				maximumFood: 1,
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
	// Create player
	const createPlayerResponse = await fetch(
		"https://snake-pit.onrender.com/create-player",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "Survivor",
			}),
		}
	)
	if (!createPlayerResponse.ok) {
		throw new Error("invalid create player response")
	}

	const { playerToken } = await createPlayerResponse.json()

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
		console.log(action)
		const payload = {
			playerToken,
			action,
		}
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
		
		if (!actionResponse.ok) {
			throw new Error("invalid action response")
		}

		const actionData = await actionResponse.json()

		const board = getBoardData(actionData)
		const me = actionData.room.players.find((player) => player.id === actionData.yourPlayerId)
		action = getNextMove(me, board)

		if(actionData.status === 'ended') {
			return
		}
	}
}

run()
