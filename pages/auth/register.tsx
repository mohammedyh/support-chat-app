import {
	Button,
	Container,
	FormControl,
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

function Register() {
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
				<Stack spacing="6">
					<Stack spacing="5">
						<FormControl isRequired>
							<FormLabel htmlFor="name">Name</FormLabel>
							<Input id="name" type="text" placeholder="Elon Musk" />
						</FormControl>

						<FormControl isRequired>
							<FormLabel htmlFor="email">Email</FormLabel>
							<Input id="email" type="email" placeholder="elon@tesla.com" />
						</FormControl>

						<FormControl isRequired>
							<FormLabel htmlFor="password">Password</FormLabel>
							<Input id="password" type="password" placeholder="********" />
							<FormHelperText color="muted">
								At least 8 characters long
							</FormHelperText>
						</FormControl>
					</Stack>
					<Stack spacing="4">
						<Button
							variant="solid"
							backgroundColor="black"
							color="white"
							_hover={{ background: 'rgba(0, 0, 0, 0.75)' }}
							type="submit"
						>
							Sign Up
						</Button>
					</Stack>
				</Stack>
				<HStack justify="center" spacing="1">
					<Text fontSize="sm" color="muted">
						Already have an account?
					</Text>
					<Button variant="link" colorScheme="blue" size="sm">
						<Link href="login">Log in</Link>
					</Button>
				</HStack>
			</Stack>
		</Container>
	);
}

export default Register;
