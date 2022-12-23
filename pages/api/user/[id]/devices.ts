// return json of devices for user
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../../lib/session';
import User from '../../../../models/User';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { id } = req.query;

	const session = await getSession(req, res);
	if (!session.userId) {
		return res.status(400).json({ success: false });
	}

	const user = await User.findOne({ _id: session.userId });
	if (!user || !user.roles.includes('support-agent')) {
		return res.status(400).json({ success: false });
	}

	const requestedUser = await User.findOne({ _id: id });
	if (!requestedUser) {
		return res.status(404).json({ success: false });
	}

	return res.status(200).json(requestedUser.devices ?? []);
}
