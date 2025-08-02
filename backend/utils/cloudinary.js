import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "backend/config/config.env" });

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export const upload_file = async (file, folder) => {
// 	return new Promise(async (resolve, reject) => {
// 		await cloudinary.v2.uploader.upload(
// 			file,
// 			{
// 				resource_type: "auto",
// 				folder,
// 			},
// 			(result) => {
// 				resolve({
// 					public_id: result.public_id,
// 					url: result.url,
// 				});
// 			}
// 		);
// 	});
// };

export const upload_file = async (file, folder) => {
	try {
		const result = await cloudinary.v2.uploader.upload(file, {
			resource_type: "auto",
			folder,
		});

		return {
			public_id: result.public_id,
			url: result.secure_url,
		};
	} catch (error) {
		console.error("Cloudinary Upload Error:", error);
		throw error;
	}
};

export const delete_file = async (file) => {
	const res = await cloudinary.v2.uploader.destroy(file);

	if (res.result === "ok") return true;
};
