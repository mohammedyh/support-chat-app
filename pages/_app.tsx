import { theme } from '@chakra-ui/pro-theme';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/inter/variable.css';
import type { AppProps } from 'next/app';
import { H } from 'highlight.run';

H.init('7e3rr6e1');

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}
