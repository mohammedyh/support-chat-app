import { theme } from '@chakra-ui/pro-theme';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import '@fontsource/inter';
import { SessionProvider } from 'next-auth/react';

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<SessionProvider session={session}>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</SessionProvider>
	);
}
