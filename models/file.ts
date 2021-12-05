import mongoose, { Document } from "mongoose";

const fileSchema = new mongoose.Schema(
	{
		filename: {
			type: String,
			required: true,
		},
		file_url: {
			type: String,
			required: true,
		},
		format: {
			type: String,
			required: true,
		},
		file_size: {
			type: String,
			required: true,
		},
		sender: {
			type: String,
		},
		receiver: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export interface IFile extends Document {
	filename: string;
	file_url: string;
	format: string;
	file_size: string;
	sender?: string;
	receiver?: string;
}

export default mongoose.model<IFile>("File", fileSchema);
