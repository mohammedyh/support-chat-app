import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
	Avatar,
	AvatarBadge,
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	HStack,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	Text,
	Textarea,
	Tooltip,
	useColorMode,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { FiSearch } from 'react-icons/fi';
import Logo from '../components/Logo';
import { SocketContextProvider } from '../components/socket/context';
import { getSession } from '../lib/session';

export default function Home({ id, userId }: { id: string; userId: string }) {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<SocketContextProvider>
			<Stack spacing="0" height="100vh">
				<Box
					as="nav"
					bg="bg-surface"
					boxShadow={useColorModeValue('sm', 'sm-dark')}
					py="5"
					px="8"
				>
					<Flex justify="space-between">
						<HStack spacing="8">
							<Logo />
							<ButtonGroup variant="ghost" spacing="1">
								<Button aria-current="page">Dashboard</Button>
							</ButtonGroup>
						</HStack>
						<HStack>
							<Button
								onClick={toggleColorMode}
								variant="ghost"
								marginRight={{ lg: '6', sm: '-1' }}
							>
								{colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
							</Button>
							<Menu>
								<MenuButton cursor="pointer">
									<Avatar boxSize="10">
										<AvatarBadge boxSize="4" bg="green.400" />
									</Avatar>
								</MenuButton>
								<MenuList>
									<MenuItem>Set Status</MenuItem>
									<MenuItem>Sign Out</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
					</Flex>
				</Box>
				<Box as="section" overflowY="auto" flex="1">
					<Flex as="section" bg="bg-canvas" height="full">
						<Flex
							flex="1"
							bg="bg-surface"
							border="1px"
							borderColor={useColorModeValue('gray.200', 'gray.700')}
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
										<Button
											variant="ghost"
											display="inline-block"
											px="0"
											height="14"
										>
											<Stack>
												<HStack spacing="3">
													<Avatar boxSize="10">
														<Tooltip label="online">
															<AvatarBadge boxSize="4" bg="green.400" />
														</Tooltip>
													</Avatar>
													<Box>
														<Text fontWeight="medium" color="emphasized">
															Test Name
														</Text>
													</Box>
												</HStack>
											</Stack>
										</Button>
										<Button
											variant="ghost"
											display="inline-block"
											px="0"
											height="14"
										>
											<Stack>
												<HStack spacing="3">
													<Avatar boxSize="10">
														<Tooltip label="online">
															<AvatarBadge boxSize="4" bg="green.400" />
														</Tooltip>
													</Avatar>
													<Box>
														<Text fontWeight="medium" color="emphasized">
															Test Name
														</Text>
													</Box>
												</HStack>
											</Stack>
										</Button>
										<Button
											variant="ghost"
											display="inline-block"
											px="0"
											height="14"
										>
											<Stack>
												<HStack spacing="3">
													<Avatar boxSize="10">
														<Tooltip label="online">
															<AvatarBadge boxSize="4" bg="green.400" />
														</Tooltip>
													</Avatar>
													<Box>
														<Text fontWeight="medium" color="emphasized">
															Test Name
														</Text>
													</Box>
												</HStack>
											</Stack>
										</Button>
									</Stack>
								</Stack>
							</Stack>
						</Flex>
						<Stack as="section" spacing="0" flex="1">
							<Box
								bg="bg-surface"
								px={{ base: '4', md: '6' }}
								py="5"
								mb="8"
								borderTop="1px"
								borderColor={useColorModeValue('gray.100', 'gray.700')}
								boxShadow={useColorModeValue('sm', 'sm-dark')}
							>
								<Stack
									spacing="4"
									direction={{ base: 'column', sm: 'row' }}
									justify="space-between"
								>
									<HStack spacing="4">
										<Avatar
											src="https://tinyurl.com/yhkm2ek8"
											name="Christoph Winston"
											boxSize={{ base: '12', sm: '14' }}
										>
											<Tooltip label="offline">
												<AvatarBadge boxSize="4" bg="gray.400" />
											</Tooltip>
										</Avatar>
										<Box>
											<HStack>
												<Text fontSize="lg" fontWeight="medium">
													Christoph Winston
												</Text>
											</HStack>
											<Text color="muted" fontSize="sm">
												Company Limited
											</Text>
										</Box>
									</HStack>
								</Stack>
							</Box>

							{/* Messages */}
							<Container maxWidth="100%" flex="1">
								<VStack alignItems="start">
									<Flex
										bg={useColorModeValue('gray.100', 'gray.700')}
										rounded="md"
										w="fit-content"
										p="3"
									>
										What you having for dinner?
									</Flex>
									<Flex
										bg={useColorModeValue('blue.200', 'blue.500')}
										position="relative"
										rounded="md"
										w="fit-content"
										p="3"
										alignSelf="end"
										_before={{
											content: "''",
											position: 'absolute',
											top: '100%',
											right: '12px',
											borderColor: `${useColorModeValue(
												'var(--chakra-colors-blue-200)',
												'var(--chakra-colors-blue-500)',
											)} transparent transparent transparent`,
											borderStyle: 'solid',
											borderWidth: '8px',
										}}
									>
										Pizza, what about you?
									</Flex>
								</VStack>
							</Container>
							<Box p="4">
								<HStack>
									<Textarea placeholder="Type a message" />
									<Button variant="primary" size="lg" marginLeft="4">
										Send
									</Button>
								</HStack>
							</Box>
						</Stack>
					</Flex>
				</Box>
			</Stack>
		</SocketContextProvider>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getSession(req, res);
	return {
		props: {
			id: session.id,
			userId: session.userId ?? null,
		},
	};
};
