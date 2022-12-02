import { Button } from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
	const session = useSession();
	const router = useRouter();

	if (session.status === 'unauthenticated') {
		router.replace('/login');
	}

	return (
		<div>
			<h1>Welcome, {session?.data?.user?.name}</h1>
			<pre>{JSON.stringify(session, null, 2)}</pre>
			<Button colorScheme="blue" onClick={() => signOut({ redirect: false })}>
				Sign Out
			</Button>
		</div>
	);
}
