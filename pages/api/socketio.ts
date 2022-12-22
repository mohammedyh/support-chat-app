// Idea: When someones sends a message for the first time send an automated response saying the agent will look into the request shortly
// Play sound when new message comes in.

import * as cookie from 'cookie';
import { Server as NetServer, Server } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO, Socket } from 'socket.io';
import dbConnect from '../../lib/dbConnect';
import {
	ClientPacket,
	MessagePacket,
	NextApiResponseServerIO,
} from '../../lib/types';
import Message from '../../models/Message';
import Session from '../../models/Session';
import User, { IUser } from '../../models/User';

export const config = {
	api: {
		bodyParser: false,
	},
};

async function sendMessages(user: IUser, socket: Socket, other?: string) {
	if (user.roles.includes('support-agent')) {
		const otherUser = await User.findOne({ _id: other });
		if (!otherUser) return;

		const messages = await Message.find({
			$or: [{ from: other }, { to: other }],
		}).sort({ createdAt: 1 });

		socket.send({
			type: 'messages',
			user: {
				id: otherUser._id.toHexString(),
				name: otherUser.name,
				email: otherUser.email,
				company: otherUser.company,
				status: otherUser.status ?? 'offline',
				roles: otherUser.roles,
			},
			messages: messages.map(message => ({
				id: message._id.toHexString(),
				from: message.from.toHexString(),
				content: message.content,
			})),
		});
	} else {
		const messages = await Message.find({
			$or: [{ from: user.id }, { to: user.id }],
		}).sort({ createdAt: 1 });

		socket.send({
			type: 'messages',
			messages: messages.map(message => ({
				id: message._id.toHexString(),
				from: message.from.toHexString(),
				content: message.content,
			})),
		});
	}
}

async function sendContacts(user: IUser, socket: Socket) {
	const customers = await User.aggregate([
		{
			$match: {
				roles: 'customer',
			},
		},
		{
			$lookup: {
				from: 'messages',
				let: {
					from: '$_id',
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ['$from', '$$from'],
							},
						},
					},
					{
						$sort: {
							createdAt: -1,
						},
					},
				],
				as: 'messages',
			},
		},
		{
			$addFields: {
				messagesLength: {
					$size: '$messages',
				},
				firstMessage: {
					$first: '$messages',
				},
			},
		},
		{
			$match: {
				messagesLength: { $gt: 0 },
			},
		},
		{
			$sort: {
				'firstMessage.createdAt': -1,
			},
		},
	]);

	socket.send({
		type: 'contacts',
		contacts: customers.map(customer => ({
			id: customer._id.toHexString(),
			name: customer.name,
			email: customer.email,
			company: customer.company,
			status: customer.status ?? 'offline',
			roles: customer.roles,
		})),
	});
}

async function socketInit(io: ServerIO) {
	await dbConnect();
	await User.updateMany({}, { status: 'offline' });

	const supportAgents = new Map<string, Socket[]>();
	const customers = new Map<string, Socket[]>();

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

		const userId = user._id!.toHexString();
		const isSupportAgent = user.roles.includes('support-agent');
		if (isSupportAgent) {
			if (!supportAgents.has(userId)) {
				supportAgents.set(userId, []);
			}
			supportAgents.get(userId)!.push(socket);
		} else {
			if (!customers.has(userId)) {
				customers.set(userId, []);
			}
			customers.get(userId)!.push(socket);
		}

		user.status = 'online';
		await user.save();

		if (isSupportAgent) {
			await sendContacts(user, socket);
		} else {
			await sendMessages(user, socket);

			for (const [userId, sockets] of supportAgents.entries()) {
				const user = await User.findOne({ _id: userId });
				if (!user) continue;

				for (const socket of sockets) {
					await sendContacts(user, socket);
				}
			}

			if (supportAgents.size === 0) {
				socket.send({ type: 'showForm' });
			}
		}

		socket.on('message', async (message: ClientPacket) => {
			if (message.type === 'sendMessage') {
				const to = message.to && isSupportAgent ? message.to : null;
				const msg = await Message.create({
					from: user!._id,
					to,
					content: message.content,
				});

				const packet: MessagePacket = {
					type: 'message',
					id: msg._id.toHexString(),
					from: msg.from.toHexString(),
					to,
					content: msg.content,
				};

				if (isSupportAgent) {
					for (const sockets of supportAgents.values()) {
						for (const socket of sockets) {
							socket.send(packet);
						}
					}

					if (packet.to) {
						const sockets = customers.get(packet.to) ?? [];
						for (const socket of sockets) {
							socket.send(packet);
						}
					}
				} else {
					for (const [userId, sockets] of supportAgents.entries()) {
						const user = await User.findOne({ _id: userId });
						if (!user) continue;

						for (const socket of sockets) {
							await sendContacts(user, socket);
						}
					}

					for (const sockets of supportAgents.values()) {
						for (const socket of sockets) {
							socket.send(packet);
						}
					}

					socket.send(packet);
				}
			} else if (message.type === 'requestUser') {
				if (isSupportAgent) {
					await sendMessages(user!, socket, message.user);
				}
			}
		});

		socket.on('disconnect', async () => {
			if (isSupportAgent) {
				const sockets = supportAgents.get(userId)!;
				sockets.splice(sockets.indexOf(socket), 1);

				if (!sockets.length) {
					supportAgents.delete(userId);

					user!.status = 'offline';
					await user!.save();
				}
			} else {
				const sockets = customers.get(userId)!;
				sockets.splice(sockets.indexOf(socket), 1);

				if (!sockets.length) {
					customers.delete(userId);

					user!.status = 'offline';
					await user!.save();

					for (const [userId, sockets] of supportAgents.entries()) {
						const user = await User.findOne({ _id: userId });
						if (!user) continue;

						for (const socket of sockets) {
							await sendContacts(user, socket);
						}
					}
				}
			}
		});
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIO,
) {
	if (!res.socket.server.io) {
		const httpServer: NetServer = res.socket.server as any;
		const io = new ServerIO(httpServer, {
			path: '/api/socketio',
		});
		res.socket.server.io = io;

		socketInit(io);
	}

	res.end();
}
