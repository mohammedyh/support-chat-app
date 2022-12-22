import * as bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { registerSchema } from '../../lib/auth';
import dbConnect from '../../lib/dbConnect';
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

	const { result, ...response } = await validate(registerSchema, req.body);

	if (result) {
		await dbConnect();

		if (await User.findOne({ email: result.email.toLowerCase() })) {
			return res.status(400).json({
				success: false,
				errors: [
					{ message: 'User already exists with this email', path: 'email' },
				],
			});
		}

		const session = await getSession(req, res);

		const user = await User.create({
			name: result.name,
			email: result.email.toLowerCase(),
			company: result.company,
			password: await bcrypt.hash(result.password, 10),
			roles: ['customer'],
		});

		session.userId = user._id.toHexString();

		return res.status(200).json({ redirect: '/' });
	}

	return res.status(response.success ? 200 : 400).json(response);
}
