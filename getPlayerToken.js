import fs from "fs"

const tokenPath = "secretToken"

export const getPlayerToken = async () => {
	const tokenFromFile = (() => {
		try {
			return fs.readFileSync(tokenPath, "utf8")
		} catch (error) {}
		return null
	})()

	if (tokenFromFile) {
		const createPlayerResponse = await fetch(
			"https://snake-pit.onrender.com/me",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					playerToken: tokenFromFile,
				}),
			}
		)
		if (createPlayerResponse.ok) {
			return tokenFromFile
		}
	}

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

	fs.writeFileSync(tokenPath, playerToken)

	return playerToken
}
