import { NextApiRequest, NextApiResponse } from 'next';
import { messageSchema } from '../../lib/auth';
import dbConnect from '../../lib/dbConnect';
import { SUPPORT_EMAIL_ADDRESS, transporter } from '../../lib/nodemailer';
import { getSession } from '../../lib/session';
import validate from '../../lib/validate';
import User from '../../models/User';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ success: false });
	}

	const { result, ...response } = await validate(messageSchema, req.body);

	if (result) {
		const session = await getSession(req, res);
		await dbConnect();

		const user = await User.findOne({ _id: session.userId });

		if (!user) {
			return res.status(400).json({ success: false });
		}

		try {
			await transporter.sendMail({
				from: {
					name: user.name,
					address: user.email,
				},
				to: SUPPORT_EMAIL_ADDRESS,
				subject: 'Chat app message',
				text: result.message,
			});
		} catch (e: unknown) {
			console.log((e as Error).message);
		}
		return res.status(200).json({ message: 'Your message was sent' });
	}

	return res.status(response.success ? 200 : 400).json(response);
}
