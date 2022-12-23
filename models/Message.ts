import { addMinutes } from 'date-fns';
import mongoose, { Document, Types } from 'mongoose';

export interface IMessage extends Document {
	from: Types.ObjectId;
	to: Types.ObjectId | null;
	content: string;
	removedAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
	from: Types.ObjectId,
	to: Types.ObjectId,
	content: String,
	removedAt: {
		type: Date,
		default: () => addMinutes(new Date(), 15),
		expires: 0,
	},
});

MessageSchema.set('timestamps', true);

export default mongoose.models.Message ||
	mongoose.model<IMessage>('Message', MessageSchema);
