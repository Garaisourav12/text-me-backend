const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// File Imports
const { app, server } = require("./socket");
const routes = require("./routes");

// Constants
const PORT = process.env.PORT || 8000;
const corsOptions = {
    origin: ["https://text-me-client.vercel.app", "http://localhost:3000"],
    credentials: true,
};

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api", routes);

// Database Connection
require("./db");

// Server Start
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
