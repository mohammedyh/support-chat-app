import {
	Avatar,
	AvatarBadge,
	Box,
	Button,
	HStack,
	Stack,
	Text,
	Tooltip,
} from '@chakra-ui/react';

function UserListItem({
	name,
	status,
	onClick,
}: {
	name: string;
	status: string;
	onClick: () => void;
}) {
	return (
		<Button
			variant="ghost"
			display="inline-block"
			px="0"
			height="14"
			onClick={onClick}
		>
			<Stack>
				<HStack spacing="3">
					<Avatar boxSize="10" name={name}>
						<Tooltip label={status} textTransform="capitalize">
							<AvatarBadge
								boxSize="4"
								bg={status === 'online' ? 'green.400' : 'gray.400'}
							/>
						</Tooltip>
					</Avatar>
					<Box>
						<Text fontWeight="medium">{name}</Text>
					</Box>
				</HStack>
			</Stack>
		</Button>
	);
}

export default UserListItem;
