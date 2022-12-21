import { useContext } from 'react';
import { AppContext } from '../components/App';

export default function useSocket() {
	return useContext(AppContext).socket;
}
