import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer;
		};
	};
};

export type ServerPacket =
	| ContactsPacket
	| MessagesPacket
	| MessagePacket
	| ShowFormPacket;

export interface ContactsPacket {
	type: 'contacts';
	contacts: Contact[];
}

export interface MessagesPacket {
	type: 'messages';
	user: Contact | null;
	messages: Message[];
}

export interface Contact {
	id: string;
	name: string;
	email: string;
	company: string;
	status: string;
	roles: string[];
}

export interface Message {
	id: string;
	from: string;
	content: string;
}

export interface SendMessagePacket {
	to: string;
	content: string;
	type: 'sendMessage';
}

export interface RequestUserPacket {
	user: string;
	type: 'requestUser';
}

export interface MessagePacket {
	type: 'message';
	id: string;
	to: string | null;
	from: string;
	content: string;
}

export interface ShowFormPacket {
	type: 'showForm';
}

export type ClientPacket = SendMessagePacket | RequestUserPacket;
