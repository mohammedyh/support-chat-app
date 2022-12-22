import {
	Avatar,
	AvatarBadge,
	Box,
	HStack,
	Stack,
	Text,
	Tooltip,
	useColorModeValue,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { AppContext } from './App';

function ChatHeader() {
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const boxShadow = useColorModeValue('sm', 'sm-dark');
	const app = useContext(AppContext);

	if (!app.user) return <></>;

	return (
		<Box
			bg="bg-surface"
			px={{ base: '4', md: '6' }}
			py="5"
			mb="8"
			borderTop="1px"
			borderColor={borderColor}
			boxShadow={boxShadow}
		>
			<Stack
				spacing="4"
				direction={{ base: 'column', sm: 'row' }}
				justify="space-between"
			>
				<HStack spacing="4">
					<Avatar name={app.contact?.name} boxSize={{ base: '12', sm: '14' }}>
						<Tooltip label="offline">
							<AvatarBadge boxSize="4" bg="green.400" />
						</Tooltip>
					</Avatar>
					<Box>
						<HStack>
							<Text fontSize="lg" fontWeight="medium">
								{app.contact?.name}
							</Text>
						</HStack>
						<Text color="muted" fontSize="sm">
							{app.contact?.company}
						</Text>
					</Box>
				</HStack>
			</Stack>
		</Box>
	);
}

export default ChatHeader;
