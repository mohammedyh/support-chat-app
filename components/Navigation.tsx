import {
	Avatar,
	AvatarBadge,
	Box,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiMoon, FiSun } from 'react-icons/fi';
import Logo from './Logo';

function Navigation({
	userName,
	userEmail,
}: {
	userName: string;
	userEmail: string;
}) {
	const { colorMode, toggleColorMode } = useColorMode();
	const router = useRouter();

	async function handleLogout() {
		await fetch('/api/logout', { method: 'POST' });
		router.reload();
	}

	return (
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
						{colorMode === 'dark' ? <FiSun size="20" /> : <FiMoon size="20" />}
					</Button>
					<Menu>
						<MenuButton cursor="pointer">
							<Avatar name={userName} boxSize="10">
								<AvatarBadge boxSize="4" bg="green.400" />
							</Avatar>
						</MenuButton>
						<MenuList>
							<MenuItem as={'div'}>
								<Text fontSize="xs">
									Logged in as <br />
									<Text fontSize="sm" as="strong">
										{userEmail}
									</Text>
								</Text>
							</MenuItem>
							<MenuDivider
								borderColor={useColorModeValue('gray.200', 'gray.600')}
								mt="2"
								mb="0"
							/>
							<MenuItem onClick={handleLogout}>Log Out</MenuItem>
						</MenuList>
					</Menu>
				</HStack>
			</Flex>
		</Box>
	);
}

export default Navigation;
