import * as bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { loginSchema } from '../../lib/auth';
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

	const session = await getSession(req, res);

	const { result, ...response } = await validate(loginSchema, req.body);

	if (result) {
		await dbConnect();

		const user = await User.findOne({ email: result.email });

		if (user) {
			// Check if the inputted password matches the database hashed password
			if (await bcrypt.compare(result.password, user.password)) {
				session.userId = user._id.toHexString();
				return res.status(200).json({ redirect: '/' });
			} else {
				// Valid email but invalid password
				return res.status(401).json({
					success: false,
					errors: [{ path: 'password', message: 'Invalid password' }],
				});
			}
		} else {
			// Return HTTP 401 response and validation messages
			return res.status(401).json({
				success: false,
				errors: [{ path: 'email', message: 'No user found with this email' }],
			});
		}
	}

	return res.status(response.success ? 200 : 400).json(response);
}
