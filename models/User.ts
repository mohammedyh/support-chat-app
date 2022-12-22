import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	company: string;
	password: string;
	status: string;
	roles: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
	name: String,
	email: String,
	company: String,
	password: String,
	status: String,
	roles: Array,
});

UserSchema.set('timestamps', true);

export default mongoose.models.User ||
	mongoose.model<IUser>('User', UserSchema);
