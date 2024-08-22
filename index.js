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
    origin: true,
    exposedHeaders: ["Content-Disposition"],
    credentials: true,
};

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Database Connection
require("./db");

// Routes
app.use("/api", routes);

// Server Start
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
