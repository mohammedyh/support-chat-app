import MongoStore from 'connect-mongo';
import nextSession from 'next-session';
import { promisifyStore } from 'next-session/lib/compat';

export const getSession = nextSession({
	store: promisifyStore(
		MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
			dbName: process.env.MONGODB_DBNAME,
		}),
	),
});
