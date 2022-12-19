import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
	_id: String,
	expires: {
		type: Date,
		expires: 0,
	},
	session: String,
});

export default mongoose.models.Session ||
	mongoose.model('Session', SessionSchema);
