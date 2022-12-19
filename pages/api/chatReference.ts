import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '../../lib/types';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'POST') {
		const message = req.body;

		// dispatch to channel "message"
		res?.socket?.server?.io?.emit('message', message);
		res.status(201).json(message);
	}
}
