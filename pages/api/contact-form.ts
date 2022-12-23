import { NextApiRequest, NextApiResponse } from 'next';
import { messageSchema } from '../../lib/schemas';
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
			const auth = Buffer.from(`${process.env.FRESHDESK_API_KEY}:X`).toString(
				'base64',
			);
			const url = `https://${process.env.FRESHDESK_DOMAIN}/api/v2/tickets`;
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Basic ' + auth,
				},
				body: JSON.stringify({
					description: result.message,
					subject: 'New message from Chat App',
					email: user.email,
					priority: 1,
					status: 2,
				}),
			});

			if (res.status < 200 || res.status >= 300) {
				throw new Error();
			}
		} catch {
			const text = `${result.message}\n\nSent from Chat App`;
			await transporter.sendMail({
				from: {
					name: user.name,
					address: 'noreply@nest.birdmarketing.co.uk',
				},
				to: SUPPORT_EMAIL_ADDRESS,
				subject: 'New message from Chat App',
				text,
				html: text
					.split('\n')
					.filter(string => string.length !== 0)
					.map(string => `<p>${string}</p>`)
					.join('\n'),
			});
		}
	}

	return res.status(response.success ? 200 : 400).json(response);
}
