import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	status: String,
	roles: Array,
});

UserSchema.set('timestamps', true);

export default mongoose.models.User || mongoose.model('User', UserSchema);
