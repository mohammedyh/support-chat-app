import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tooltip,
	Tr,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useCallback, useContext, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { UAParser } from 'ua-parser-js';
import type { IUser } from '../models/User';
import { AppContext } from './App';

function DevicesModal() {
	const [loading, setLoading] = useState(false);
	const [devices, setDevices] = useState<IUser['devices']>([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const app = useContext(AppContext);
	const getDevices = useCallback(async () => {
		if (!app.contact) return onClose();

		setLoading(true);

		try {
			const result = await fetch(`/api/user/${app.contact.id}/devices`);
			const devices = await result.json();
			setDevices(devices);
			onOpen();
		} catch {
			onClose();
			toast({
				position: 'top-right',
				title: 'Request failed.',
				description: 'Failed to show customer device information',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	}, [app.contact, onClose, onOpen, toast]);

	const parserResults = new UAParser(JSON.stringify(devices)).getResult();
	return (
		<>
			<Button isLoading={loading} onClick={getDevices}>
				View Devices
			</Button>
			<Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Customer Device Information</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TableContainer>
							<Table size="lg">
								<Thead>
									<Tr>
										<Th>Browser</Th>
										<Th>Browser Version</Th>
										<Th>OS</Th>
										<Th display="flex" alignItems="center" gap={1}>
											OS Version
											<Tooltip
												label="Version number can be inaccurate"
												aria-label="Version number can be inaccurate"
											>
												<span style={{ cursor: 'pointer' }}>
													<FiInfo />
												</span>
											</Tooltip>
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>{parserResults.browser.name}</Td>
										<Td>{parserResults.browser.version}</Td>
										<Td>{parserResults.os.name}</Td>
										<Td>{parserResults.os.version}</Td>
									</Tr>
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default DevicesModal;
