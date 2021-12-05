import express, { response } from "express";

import cors from "cors";

import connectDB from "./config/db";

import fileRoute from "./routes/files";

import { v2 as cloudinary } from "cloudinary";

const app = express();

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_API_CLOUD,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

app.use(cors());

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use("/api/files", fileRoute);

app.listen(8000, () => {
	console.log("Server is on");
});
