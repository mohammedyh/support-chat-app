import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { connect, Socket } from 'socket.io-client';
import { Contact, Message, ServerPacket } from '../lib/types';

async function requestNotifications(): Promise<boolean> {
	if (!('Notification' in window)) {
		return false;
	}

	if (Notification.permission === 'granted') {
		return true;
	} else {
		const result = await Notification.requestPermission();
		return result === 'granted';
	}
}

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
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		requestNotifications();
	}, []);

	useEffect(() => {
		const socket = connect('/', {
			path: '/api/socketio',
		});

		setSocket(socket);

		socket.on('message', async (message: ServerPacket) => {
			if (message.type === 'contacts') {
				setContacts(message.contacts);
			} else if (message.type === 'messages') {
				if (message.user) {
					setContact(message.user);
				}
				setMessages(message.messages);
			} else if (message.type === 'message') {
				if (audioRef.current && message.from !== user.id) {
					audioRef.current.currentTime = 0;
					audioRef.current.play();

					if (await requestNotifications()) {
						const notification = new Notification('New message', {
							body: message.content,
							renotify: true,
						});
					}
				}
				if (
					message.from === contact?.id ||
					message.to === contact?.id ||
					message.to === user.id ||
					message.from === user.id
				) {
					setMessages(prevMessages => [...prevMessages, message]);
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
			<audio
				src="/chat-notification-sound.mp3"
				autoPlay={false}
				ref={audioRef}
			/>
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
