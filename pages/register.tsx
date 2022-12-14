import {
	Button,
	Container,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Heading,
	HStack,
	Input,
	Stack,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Logo from '../components/Logo';
import { registerSchema } from '../lib/schemas';
import { getSession } from '../lib/session';
import validate from '../lib/validate';

function Register() {
	const router = useRouter();
	const { colorMode } = useColorMode();
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
			name: formData.get('name'),
			email: formData.get('email'),
			company: formData.get('company'),
			password: formData.get('password'),
		};

		let response = await validate(registerSchema, data);

		if (response.success) {
			const res = await fetch('/api/register', {
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
				<Stack spacing="6" align="center">
					<Logo />
					<Stack spacing="3" textAlign="center">
						<Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
							Create an account
						</Heading>
					</Stack>
				</Stack>

				<form action="/api/register" method="POST" onSubmit={handleSubmit}>
					<Stack spacing="6">
						<Stack spacing="5">
							<FormControl isRequired isInvalid={!!errors.name}>
								<FormLabel htmlFor="name">Name</FormLabel>
								<Input
									id="name"
									type="text"
									placeholder="Elon Musk"
									name="name"
								/>
								{errors.name && (
									<FormErrorMessage>{errors.name}</FormErrorMessage>
								)}
							</FormControl>
							<FormControl isRequired isInvalid={!!errors.email}>
								<FormLabel htmlFor="email">Email</FormLabel>
								<Input
									id="email"
									type="email"
									placeholder="elon@tesla.com"
									name="email"
								/>
								{errors.email && (
									<FormErrorMessage>{errors.email}</FormErrorMessage>
								)}
							</FormControl>
							<FormControl isRequired isInvalid={!!errors.company}>
								<FormLabel htmlFor="company">Company</FormLabel>
								<Input
									id="company"
									type="text"
									placeholder="Test Company Limited"
									name="company"
								/>
								{errors.company && (
									<FormErrorMessage>{errors.company}</FormErrorMessage>
								)}
							</FormControl>
							<FormControl isRequired isInvalid={!!errors.password}>
								<FormLabel htmlFor="password">Password</FormLabel>
								<Input
									id="password"
									type="password"
									placeholder="********"
									name="password"
								/>
								{errors.password ? (
									<FormErrorMessage>{errors.password}</FormErrorMessage>
								) : (
									<FormHelperText color="muted">
										At least 8 characters long
									</FormHelperText>
								)}
							</FormControl>
						</Stack>
						<Stack spacing="4">
							<Button
								variant="solid"
								backgroundColor={useColorModeValue(
									'blackAlpha.900',
									'blue.400',
								)}
								color="white"
								_hover={{
									backgroundColor() {
										return colorMode === 'light'
											? 'var(--chakra-colors-blackAlpha-700)'
											: 'var(--chakra-colors-blue-600)';
									},
								}}
								type="submit"
								isLoading={loading}
							>
								Sign Up
							</Button>
						</Stack>
					</Stack>
				</form>
				<HStack justify="center" spacing="1">
					<Text fontSize="sm" color="muted">
						Already have an account?
					</Text>
					<Button variant="link" colorScheme="blue" size="sm">
						<Link href="/login">Log in</Link>
					</Button>
				</HStack>
			</Stack>
		</Container>
	);
}

export default Register;

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
