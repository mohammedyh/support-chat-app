import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../lib/session';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ success: false });
	}

	const session = await getSession(req, res);

	session.destroy();
	return res.status(200).json({ isLoggedIn: false });
}
// Check if this is right - with JDSports
