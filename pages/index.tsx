import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Logo from '../components/Logo';
import { SocketContextProvider } from '../components/socket/context';
import { getSession } from '../lib/session';

export default function Home({ id, userId }: { id: string; userId: string }) {
	const { colorMode, toggleColorMode } = useColorMode();

	// Add a check to redirect if user is not authenticated
	return (
		<SocketContextProvider>
			<Box
				as="nav"
				bg="bg-surface"
				boxShadow={useColorModeValue('sm', 'sm-dark')}
			>
				<Container py={{ base: '3', lg: '4' }}>
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
								<MenuButton as={Avatar} cursor="pointer" />
								<MenuList>
									<MenuItem>Set Status</MenuItem>
									<MenuItem>Sign Out</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
					</Flex>
				</Container>
			</Box>

			<Box as="section" height="100vh" overflowY="auto">
				<Container pt={{ base: '8', lg: '12' }} pb={{ base: '12', lg: '24' }}>
					<p>Session ID: {id}</p>
					<p>User ID: {userId}</p>
				</Container>
			</Box>
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
