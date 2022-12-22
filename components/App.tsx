// Add authed user to AppContext - add from props of app using home or something

import { fi } from 'date-fns/locale';
import { createContext, useCallback, useEffect, useState } from 'react';
import { connect, Socket } from 'socket.io-client';
import { Contact, Message, ServerPacket } from '../lib/types';

interface AppContextState {
	contact: Contact | null;
	user: Contact;
	messages: Message[];
	socket: Socket | null;
	showForm: boolean;
	contacts: Contact[];
	requestUser: (id: string) => void;
	sendMessage: (content: string, to?: string | null) => void;
}

export default function App({
	children,
	user,
}: {
	children: React.ReactNode;
	user: Contact;
}) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [contact, setContact] = useState<AppContextState['contact']>(null);
	const [messages, setMessages] = useState<AppContextState['messages']>([]);
	const [contacts, setContacts] = useState<AppContextState['contacts']>([]);
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		const socket = connect('/', {
			path: '/api/socketio',
		});

		setSocket(socket);

		socket.on('message', (message: ServerPacket) => {
			if (message.type === 'contacts') {
				setContacts(message.contacts);
			} else if (message.type === 'messages') {
				if (message.user) {
					setContact(message.user);
				}
				setMessages(message.messages);
			} else if (message.type === 'message') {
				if (
					message.from === contact?.id ||
					message.to === contact?.id ||
					message.to === user.id ||
					message.from === user.id
				) {
					setMessages(prevMessages => {
						const messages = [...prevMessages, message];
						return messages;
					});
				}
			} else if (message.type === 'showForm') {
				setShowForm(true);
			}
		});

		return () => {
			socket.disconnect();
			setSocket(null);
		};
	}, [contact, user.id]);

	const requestUser = useCallback(
		(id: string) => {
			if (!socket) return;

			socket.send({
				user: id,
				type: 'requestUser',
			});
		},
		[socket],
	);

	const sendMessage = useCallback(
		(content: string, to: string | null = null) => {
			if (!socket) return;
			const trimmedContent = content.trim();

			socket.send({
				to,
				content: trimmedContent,
				type: 'sendMessage',
			});
		},
		[socket],
	);
	return (
		<AppContext.Provider
			value={{
				contact,
				user,
				contacts,
				socket,
				showForm,
				requestUser,
				sendMessage,
				messages,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export const AppContext = createContext<AppContextState>({
	user: null as any,
	contact: null,
	contacts: [],
	messages: [],
	socket: null,
	showForm: false,
	requestUser: () => {},
	sendMessage: () => {},
});
