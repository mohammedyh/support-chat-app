import { Image, useColorMode } from '@chakra-ui/react';

export default function Logo() {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<Image
			src={
				colorMode === 'light' ? '/bird-logo-black.png' : '/bird-logo-white.png'
			}
			alt="Company."
			width={100}
			objectFit="cover"
		/>
	);
}
