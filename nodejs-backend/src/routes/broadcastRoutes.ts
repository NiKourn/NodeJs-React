import express, { Request, Response } from 'express' // Use import for express and types
import { sendMessageToClients } from '../webSocket'

const router = express.Router()

router.post('/post', (req: Request, res: Response) => {
	const { message } = req.body
	if (!message) {
		res.status(400).json({ error: 'Message is required' })
		return
	}

	sendMessageToClients(message)
	console.log('Message broadcasted:', message)
	res.status(200).json({ message: `Message broadcasted - ${message}` })
})

export default router
