import {
	Button,
	Checkbox,
	Container,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Image,
	Input,
	Stack,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';
import { getCsrfToken, getSession, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Login({ csrfToken }: { csrfToken: string }) {
	return (
		<Container maxW="md" py={{ base: '12', md: '24' }}>
			<Stack spacing="8">
				<Stack spacing="6">
					<Image
						src="/bird-logo.png"
						alt="Company."
						width={150}
						marginX="auto"
					/>
					<Stack spacing={{ base: '2', md: '3' }} textAlign="center">
						<Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
							Log in to your account
						</Heading>
					</Stack>
				</Stack>

				<form method="post" action="/api/auth/callback/credentials">
					<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
					<Stack spacing="6">
						<Stack spacing="5">
							<FormControl isRequired>
								<FormLabel htmlFor="email">Email</FormLabel>
								<Input
									id="email"
									name="email"
									placeholder="elon@tesla.com"
									type="email"
									defaultValue="mo@birdmarketing.co.uk"
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel htmlFor="password">Password</FormLabel>
								<Input
									id="password"
									name="password"
									placeholder="********"
									type="password"
									defaultValue="password"
								/>
							</FormControl>
						</Stack>
						<HStack justify="space-between">
							<Checkbox defaultChecked>Remember me</Checkbox>
							<Button variant="link" colorScheme="blue" size="sm">
								Forgot password
							</Button>
						</HStack>
						<Stack spacing="4">
							<Button
								variant="solid"
								backgroundColor="black"
								color="white"
								_hover={{ background: 'rgba(0, 0, 0, 0.75)' }}
								type="submit"
							>
								Sign In
							</Button>
						</Stack>
					</Stack>
				</form>

				<HStack spacing="1" justify="center">
					<Text fontSize="sm" color="muted">
						Dont have an account?
					</Text>

					<Button variant="link" colorScheme="blue" size="sm">
						<Link href="/register">Sign up</Link>
					</Button>
				</HStack>
			</Stack>
		</Container>
	);
}

// @ts-ignore
export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (session !== null) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	};
}
