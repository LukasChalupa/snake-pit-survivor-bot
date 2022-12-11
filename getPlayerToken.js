export const getPlayerToken = async () => {
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
	return playerToken
}
