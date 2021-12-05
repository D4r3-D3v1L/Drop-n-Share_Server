import express from "express";
import multer from "multer";
import File from "../models/file";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

import https from "https";

const router = express.Router();

const multerStorage = multer.diskStorage({});

const upload = multer({
	storage: multerStorage,
});

router.post("/upload", upload.single("myFile"), async (req, res) => {
	try {
		if (!req.file)
			return res.status(400).json({ message: "File not found" });

		console.log(req.file);
		let uploadedFile: UploadApiResponse;
		try {
			uploadedFile = await cloudinary.uploader.upload(req.file?.path!, {
				folder: "FileShare",
				resource_type: "auto",
				quality: "60",
			});
			const { originalname } = req.file!;
			const { secure_url, bytes, format } = uploadedFile;

			const file = await File.create({
				filename: originalname,
				file_url: secure_url,
				file_size: bytes,
				format: format,
			});
			return res.status(200).json({
				id: file._id,
				link: `${process.env.CLIENT_API_BASE}download/${file._id}`,
			});
		} catch (error) {
			return res.status(400).json({ message: "Upload Error" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: "Upload Error" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const file = await File.findById(id);
		if (!file) {
			return res.status(400).json({ messgae: "File not found" });
		}
		const { filename, file_size } = file;
		return res
			.status(200)
			.json({ name: filename, size: file_size, id: id });
	} catch (error) {
		return res.status(500).json({ messgae: "Internal Error" });
	}
});

router.get("/:id/download", async (req, res) => {
	try {
		const id = req.params.id;
		const file = await File.findById(id);
		if (!file) {
			return res.status(400).json({ messgae: "File not found" });
		}
		https.get(file.file_url, (fileStream) => {
			fileStream.pipe(res);
		});
	} catch (error) {
		return res.status(500).json({ messgae: "Internal Error" });
	}
});

export default router;
