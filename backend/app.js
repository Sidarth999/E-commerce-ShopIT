import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import { fileURLToPath } from "url";

import path from "path";

const __file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__file_name);

// Handle Uncaught exception
process.on("uncaughtException", (err) => {
	console.log(`ERROR: ${err}`);
	console.log("Shutting down due to uncaught exception");
	process.exit(1);
});

if(process.env.NODE_ENV !== "PRODUCTION"){
	dotenv.config({ path: "backend/config/config.env" });
}

// Connecting to database
connectDatabase();

app.use(
	express.json({
		limit: "10mb",
		verify: (req, res, buf) => {
			req.rawBody = buf.toString();
		},
	})
);
app.use(cookieParser());

// Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

if (process.env.NODE_ENV === "PRODUCTION") {
	app.use(express.static(path.join(__dirname, "../frontend/build")));

	app.get(/(.*)/, (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
	});
}

// Using error Middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
	console.log(
		`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
	);
});

// Handle Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
	console.log(`ERROR: ${err}`);
	console.log("Shutting down server due to Unhandled Promise Rejection");
	server.close(() => {
		process.exit(1);
	});
});
