import {
	Button,
	Checkbox,
	Container,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Input,
	Stack,
	Text,
	useBreakpointValue,
	useColorMode,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Logo from '../components/Logo';
import { loginSchema } from '../lib/auth';
import { getSession } from '../lib/session';
import validate from '../lib/validate';

function Login({ csrfToken }: { csrfToken: string }) {
	const { colorMode } = useColorMode();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<{
		success: boolean;
		errors: {
			message: string;
			path: string | undefined;
			type: string | undefined;
			value: any;
		}[];
	} | null>(null);

	const errors = useMemo(() => {
		if (response?.errors?.length) {
			const errors: Record<string, string> = {};

			for (const { path, message } of response.errors) {
				if (!path) continue;
				errors[path] = message;
			}

			return errors;
		} else {
			return {};
		}
	}, [response?.errors]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			email: formData.get('email'),
			password: formData.get('password'),
		};

		let response = await validate(loginSchema, data);

		if (response.success) {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			const json = await res.json();

			if (json.redirect) {
				router.push(json.redirect);
				return;
			} else {
				response = json;
			}
		}

		setResponse(response);
		setLoading(false);
	}

	return (
		<Container maxW="md" py={{ base: '12', md: '24' }}>
			<Stack spacing="8">
				<Stack spacing="6">
					<Logo />
					<Stack spacing={{ base: '2', md: '3' }} textAlign="center">
						<Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
							Log in to your account
						</Heading>
					</Stack>
				</Stack>

				<form method="POST" onSubmit={handleSubmit}>
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
								isLoading={loading}
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

export default Login;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getSession(req, res);

	if (session?.userId) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
};
