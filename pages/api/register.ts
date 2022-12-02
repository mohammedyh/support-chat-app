import * as bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

import { registerSchema } from '../../lib/auth';
import dbConnect from '../../lib/dbConnect';
import validate from '../../lib/validate';
import User from '../../models/User';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ success: false });
	}

	// check if user exists with email
	// if not, create user or redirect to login page
	const { result, ...response } = await validate(registerSchema, req.body);

	if (result) {
		await dbConnect();

		await User.create({
			name: result.name,
			email: result.email,
			password: await bcrypt.hash(result.password, 10),
		});

		return res.status(200).json({ redirect: '/login' });
	}

	return res.status(response.success ? 200 : 400).json(response);
}
