import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.config.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

// Middlewares:-
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes :-
app.use("/api/auth", authRoutes);
app.use("/api/chatRoom", chatRoutes)

// Socket and Server initialisation:-
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT;
connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening at port ${PORT}`);
    })
})
.catch((err) => {
    console.log(`Error in starting server: ${err.message}`);
})