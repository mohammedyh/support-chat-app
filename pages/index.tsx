import {
	Box,
	Button,
	Container,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Textarea,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React, { useContext, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import App, { AppContext } from '../components/App';
import ChatHeader from '../components/ChatHeader';
import Message from '../components/Message';
import Navigation from '../components/Navigation';
import UserListItem from '../components/UserListItem';
import { messageSchema } from '../lib/auth';
import dbConnect from '../lib/dbConnect';
import { getSession } from '../lib/session';
import { Contact } from '../lib/types';
import validate from '../lib/validate';
import User from '../models/User';

function Home() {
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const app = useContext(AppContext);
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<{
		success: boolean;
		errors: {
			message: string;
			path: string | undefined;
			type: string | undefined;
			value: any;
		}[];
	} | null>(null);
	const errors = useMemo(() => {
		if (response?.errors?.length) {
			const errors: Record<string, string> = {};

			for (const { path, message } of response.errors) {
				if (!path) continue;
				errors[path] = message;
			}

			return errors;
		} else {
			return {};
		}
	}, [response?.errors]);

	const user = useMemo(() => app.user, [app.user]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		// Handle empty textarea

		const formData = new FormData(e.currentTarget);
		const data = { message: formData.get('message') };

		let response = await validate(messageSchema, data);

		if (response.success) {
			const res = await fetch('/api/contact-form', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			const json = await res.json();

			response = json;
		}

		setResponse(response);
		setLoading(false);
	}

	return (
		<Flex as="section" bg="bg-canvas" height="full">
			{user.roles.includes('support-agent') && (
				<Flex
					flex="1"
					bg="bg-surface"
					border="1px"
					borderColor={borderColor}
					maxW={{ base: 'full', sm: 'xs' }}
					py={{ base: '6', sm: '8' }}
					px={{ base: '4', sm: '6' }}
				>
					<Stack justify="space-between" spacing="1">
						<Stack spacing={{ base: '5', sm: '6' }} shouldWrapChildren>
							<InputGroup>
								<InputLeftElement pointerEvents="none">
									<Icon as={FiSearch} color="muted" boxSize="5" />
								</InputLeftElement>
								<Input placeholder="Search" />
							</InputGroup>

							<Stack spacing="3">
								{app.contacts.map(contact => (
									<UserListItem
										key={contact.id}
										name={contact.name}
										status={contact.status}
										onClick={() => app.requestUser(contact.id)}
									/>
								))}
							</Stack>
						</Stack>
					</Stack>
				</Flex>
			)}
			<Stack as="section" spacing="0" flex="1">
				{app.contact && <ChatHeader />}
				<Container maxWidth="100%" flex="1">
					<VStack alignItems="start" spacing="4">
						{app.messages.map(message => (
							<Message
								key={message.id}
								content={message.content}
								isReply={message.from !== user.id}
							/>
						))}
					</VStack>

					{app.showForm && (
						<Modal
							isOpen={app.showForm}
							onClose={() => {}}
							size="lg"
							isCentered
						>
							<ModalOverlay />
							<ModalContent>
								<form method="POST" onSubmit={handleSubmit}>
									<ModalHeader>
										There are currently no support agents online. Send us a
										message and we&apos;ll get back to you!
									</ModalHeader>

									<ModalBody pb={6}>
										<FormControl mt={4} isRequired isInvalid={!!errors.message}>
											<FormLabel>Message</FormLabel>
											<Textarea
												rows={8}
												name="message"
												placeholder="Type your message"
											/>
											{errors.message && (
												<FormErrorMessage>{errors.message}</FormErrorMessage>
											)}
										</FormControl>
									</ModalBody>

									<ModalFooter>
										<Button
											colorScheme="blue"
											mr={3}
											type="submit"
											isLoading={loading}
										>
											Send
										</Button>
									</ModalFooter>
								</form>
							</ModalContent>
						</Modal>
					)}
				</Container>
				<Box p="4">
					{(app.contact || !app.user.roles.includes('support-agent')) && (
						<HStack>
							<Textarea
								placeholder="Type a message"
								onChange={e => setContent(e.target.value)}
								value={content}
							/>
							<Button
								variant="primary"
								size="lg"
								marginLeft="4"
								onClick={() => {
									if (!content.trim()) {
										setContent('');
										return alert('Message cannot be empty you dummy');
									}
									app.sendMessage(content, app.contact?.id);
									setContent('');
								}}
							>
								Send
							</Button>
						</HStack>
					)}
				</Box>
			</Stack>
		</Flex>
	);
}

export default function HomeWrapper({ user }: { user: Contact }) {
	return (
		<App user={user}>
			<Stack spacing="0" height="100vh">
				<Navigation userName={user.name} userEmail={user.email} />

				<Home />

				<Box as="section" overflowY="auto" flex="1"></Box>
			</Stack>
		</App>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getSession(req, res);
	await dbConnect();
	const user = await User.findOne({ _id: session.userId });

	if (!user) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	return {
		props: {
			user: {
				id: user._id.toHexString(),
				name: user.name,
				email: user.email,
				company: user.company,
				status: user.status ?? 'offline',
				roles: user.roles,
			},
		},
	};
};
