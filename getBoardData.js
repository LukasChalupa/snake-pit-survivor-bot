import { FOOD_CODE, FREE_SPACE_CODE, WALL_CODE } from "./snake-ai.js"

export const getBoardData = (actionData) => {
	const { players, food, width, height } = actionData.room

	const board = Array(height)
		.fill()
		.map(() => Array(width).fill(FREE_SPACE_CODE))

	food.forEach((foodItem) => {
		const { position } = foodItem
		board[position.y][position.x] = FOOD_CODE
	})

	players.forEach((player) => {
		const { fromHeadPosition } = player
		fromHeadPosition.forEach((position) => {
			board[position.y][position.x] = WALL_CODE
		})
	})

	return board
}
