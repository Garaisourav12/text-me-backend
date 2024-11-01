const express = require("express");
const os = require("os");
const cluster = require("cluster");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// File Imports
const { app, server } = require("./socket");
const connectDB = require("./db");
const routes = require("./routes");

// Constants
const PORT = process.env.PORT || 8000;
const corsOptions = {
	origin: true,
	credentials: true,
};
const numCPUs = os.cpus().length;

// Start Server with Clustering
(async () => {
	if (cluster.isPrimary) {
		console.log(`Master process ${process.pid} is running`);

		for (let i = 0; i < Math.min(numCPUs, 2); i++) {
			cluster.fork();
		}

		cluster.on("exit", (worker, code, signal) => {
			console.log(
				`Worker process ${worker.process.pid} died. Restarting...`
			);
			cluster.fork();
		});
	} else {
		// Connect to MongoDB
		await connectDB();

		// Middlewares
		app.use(express.json());
		app.use(cookieParser());
		app.use(cors(corsOptions));

		app.use((req, res, next) => {
			res.set("X-Process-ID", process.pid); // Set the process ID in the headers
			next();
		});

		// Routes
		app.get("/", (req, res) => {
			// Entry point
			return res.json({
				message: "Welcome to the TextMe API",
				version: "1.0.0",
			});
		});
		app.use("/api", routes); // Functional routes
		app.use((req, res) => {
			// Unknown routes
			return res.status(404).json({
				message: `Cannot ${req.method} ${req.url}`,
				error: "Not Found",
				version: "1.0.0",
			});
		});

		// Start Server
		server.listen(PORT, () => {
			console.log(
				`Worker process ${process.pid} is listening on port ${PORT}`
			);
			console.log(`http://localhost:${PORT}`);
		});
	}
})();
