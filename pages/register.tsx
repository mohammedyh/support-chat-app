import {
	Button,
	Container,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Heading,
	HStack,
	Image,
	Input,
	Stack,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { registerSchema } from '../lib/auth';
import validate from '../lib/validate';

function Register() {
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

	// convert array into an object with the key being path and value being the message
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
	console.log(errors);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
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
					<Image
						src="/bird-logo.png"
						alt="Company."
						width={150}
						marginX="auto"
					/>
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
								backgroundColor="black"
								color="white"
								_hover={{ background: 'rgba(0, 0, 0, 0.75)' }}
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
