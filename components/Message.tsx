import { Flex, useColorModeValue } from '@chakra-ui/react';

function Message({
	content,
	isReply = false,
}: {
	content: string;
	isReply?: boolean;
}) {
	const userMessageColor = useColorModeValue(
		'var(--chakra-colors-blue-200)',
		'var(--chakra-colors-blue-500)',
	);
	const replyMessageColor = useColorModeValue(
		'var(--chakra-colors-gray-200)',
		'var(--chakra-colors-gray-700)',
	);
	return (
		<Flex
			style={{
				backgroundColor: isReply === false ? userMessageColor : replyMessageColor,
			}}
			position="relative"
			rounded="md"
			w="fit-content"
			p="3"
			alignSelf={isReply === true ? 'start' : 'end'}
			_before={{
				content: "''",
				position: 'absolute',
				top: '100%',
				right: `${isReply === false ? '12px' : 'unset'}`,
				left: `${isReply ? '12px' : 'unset'}`,
				borderColor: `${
					isReply ? replyMessageColor : userMessageColor
				} transparent transparent transparent`,
				borderStyle: 'solid',
				borderWidth: '8px',
			}}
		>
			{content}
		</Flex>
	);
}

export default Message;
