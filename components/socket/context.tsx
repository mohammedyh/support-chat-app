import { createContext, useEffect, useState } from 'react';
import { connect, Socket } from 'socket.io-client';

interface SocketContextState {
	socket: Socket | null;
}

export const SocketContext = createContext<SocketContextState>({
	socket: null,
});

export function SocketContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		// if (!session.data) return

		// connect to socket server
		const socket = connect('/', {
			path: '/api/socketio',
		});

		setSocket(socket);

		// log socket connection
		socket.on('connect', () => {
			console.log('SOCKET CONNECTED!', socket.id);
		});

		// update chat on new message dispatched
		socket.on('message', (message: any) => {
			console.log(message);
			// chat.push(message);
			// setChat([...chat]);
		});

		return () => {
			socket.disconnect();
			setSocket(null);
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
}
