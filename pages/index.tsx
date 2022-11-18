import { signOut, useSession } from 'next-auth/react';

export default function Home() {
	const session = useSession();
	return (
		<div>
			<h1>Index</h1>
			<p>{JSON.stringify(session, null, 2)}</p>
			<button onClick={() => signOut()}>Sign Out</button>
		</div>
	);
}
