import { WALL_CODE } from "./snake-ai.js"

const FOOD_VALUE = 10

export const getNextMove = (player, board) => {
	const height = board.length
	const width = board[0].length

	const initialXDelta =
		player.fromHeadPosition[0].x - player.fromHeadPosition[1].x
	const initialYDelta =
		player.fromHeadPosition[0].y - player.fromHeadPosition[1].y

	const initialDirection = getDirection(initialXDelta, initialYDelta)

	const visited = Array(height)
		.fill()
		.map(() => Array(width).fill(null))

	//return Math.random() > 0.3 ? 'forward' : 'right'

	const stack = []
	const initial = { ...player.fromHeadPosition[0], value: 0, previous: null }
	stack.push(initial)

	let max = initial

	while (stack.length > 0) {
		const current = stack[stack.length - 1]
		stack.pop()

		if (visited[current.y][current.x] !== null) {
			continue
		}
		visited[current.y][current.x] = current.value

		const xDeltas = [0, -1, 1]
		const yDeltas = [0, -1, 1]

		for (const xDelta of xDeltas.sort(() => Math.random() - 0.5)) {
			for (const yDelta of yDeltas.sort(() => Math.random() - 0.5)) {
				// for (const xDelta of xDeltas) {
				// 	for (const yDelta of yDeltas) {
				if (
					(xDelta !== 0 && yDelta !== 0) ||
					Math.abs(xDelta) === Math.abs(yDelta)
				) {
					continue
				}
				const newX = current.x + xDelta
				const newY = current.y + yDelta
				const newPosition = {
					x: newX,
					y: newY,
					value: current.value + 1,
					previous: current,
				}

				if (
					(board[newPosition.y] ?? false) &&
					(board[newPosition.y][newPosition.x] ?? false) &&
					board[newPosition.y][newPosition.x] !== WALL_CODE &&
					visited[newPosition.y][newPosition.x] === null
				) {
					// if (board[newPosition.y][newPosition.x] === FOOD_CODE) {
					// 	newPosition.value += FOOD_VALUE
					// }

					if (newPosition.value > max.value) {
						max = newPosition
					}

					stack.push(newPosition)
				}
			}
		}

		//console.table(visited)
	}

	let current = max
	let direction = "forward"
	while (current.value > 0) {
		if (current.previous.value === 0) {
			direction = getDirection(
				current.x - current.previous.x,
				current.y - current.previous.y
			)
			break
		}

		current = current.previous
	}
	console.log("directions", initialDirection, direction)
	const relativeDirection = getRelativeDirection(initialDirection, direction)
	console.log("relativeDirection", relativeDirection)

	return relativeDirection
}

const getDirection = (xDelta, yDelta) => {
	return xDelta === 1
		? "right"
		: xDelta === -1
		? "left"
		: yDelta === 1
		? "down"
		: "up"
}

const getRelativeDirection = (initialDirection, direction) => {
	if (initialDirection === "right") {
		if (direction === "right") {
			return "forward"
		} else if (direction === "up") {
			return "left"
		} else {
			return "right"
		}
	} else if (initialDirection === "left") {
		if (direction === "left") {
			return "forward"
		} else if (direction === "up") {
			return "right"
		} else {
			return "left"
		}
	} else if (initialDirection === "up") {
		if (direction === "up") {
			return "forward"
		} else if (direction === "right") {
			return "right"
		} else {
			return "left"
		}
	} else {
		if (direction === "down") {
			return "forward"
		} else if (direction === "right") {
			return "left"
		} else {
			return "right"
		}
	}
}
