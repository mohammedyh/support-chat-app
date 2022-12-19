import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import * as cookie from 'cookie';
import { NextApiResponseServerIO } from '../../lib/types';
import dbConnect from '../../lib/dbConnect';
import User, { IUser } from '../../models/User';
import Session from '../../models/Session';
import { Model } from 'mongoose';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIO,
) {
	if (!res.socket.server.io) {
		// console.log('New Socket.io server...');
		const httpServer: NetServer = res.socket.server as any;
		const io = new ServerIO(httpServer, {
			path: '/api/socketio',
		});

		await dbConnect();
		await User.updateMany({}, { status: 'offline' });

		// Add online status to a user
		// use connection event to modify the user
		// on connection find user from database.
		// use headers to get session token (getSession stuff) and find user.

		// figure out how to get the user from the headers
		io.on('connection', async socket => {
			let user: IUser | null = null;
			const cookies = cookie.parse(socket.handshake.headers.cookie ?? '');

			if (cookies.sid) {
				const currentSession = await Session.findOne({ _id: cookies.sid });

				if (currentSession) {
					const data = JSON.parse(currentSession.session);

					if (data.userId) {
						user = await User.findOne({ _id: data.userId });
					}
				}
			}

			if (!user) {
				socket.disconnect();
				return;
			}

			user.status = 'online';
			await user.save();

			socket.on('disconnect', async () => {
				user!.status = 'offline';
				await user!.save();
			});
		});
		// append SocketIO server to Next.js socket server response
		res.socket.server.io = io;
	}

	res.end();
}
