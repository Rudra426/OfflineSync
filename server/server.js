import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import dns from "dns";


import syncRoutes from './routes/syncRoutes.js';
import { initializeSocket } from './socket/socketHandler.js';

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

initializeSocket(io);

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/sync', syncRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
