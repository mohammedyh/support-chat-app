import React from 'react';
import { SocketContext } from './context';

export default function useSocket() {
	return React.useContext(SocketContext).socket;
}
