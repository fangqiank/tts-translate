if(process.env.NODE_ENV === 'production') {
		(async () => {
			const dotenv = await import('dotenv')
			dotenv.config()
		})()
}

const handler = async (req, res) => {
	if(req.method !== 'POST')
		return res
			.status(405)
			.json({ error: `Method ${req.method} Not Allowed` })	

	const { text, target } = req.body

	if(!text || !target)
		return res
			.status(400)
			.json({ error: 'Missing required fields' })

	const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
	const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`

	try{
		const response = await fetch(apiUrl, {
			method: 'POST',
			body: JSON.stringify({
				q: text,
				target,
				format: 'text'
			}),
			headers: { 'Content-Type': 'application/json' }
		})

		if(!response.ok){
			const errText = await res.text()
			return res
				.status(res.status)
				.json({ error: `Error ${res.status}: ${errText}` })
		}

		const data = await response.json()
		res.status(200).json(data)
	}catch(err){
		console.error('Translation Error: ', error)
		res
			.status(500)
			.json({ error: 'Failed to translate text' })
	}
}

export default handler