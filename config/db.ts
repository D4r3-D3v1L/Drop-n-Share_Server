import mongoose from "mongoose";

const connectDB = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI!);
	} catch (error) {
		console.log("connection error", error);
	}

	const db = mongoose.connection;

	if (db.readyState > 1) {
		console.log("Connected to Database");
		return;
	}
	db.on("error", () => {
		console.log("connection failed");
	});
};

export default connectDB;
