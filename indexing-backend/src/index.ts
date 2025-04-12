import express from "express";
import { PrismaClient } from 'prisma-shared';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const prisma = new PrismaClient();
const app = express()

// Middleware
app.use(cors());
app.use(express.json());

app.get("/status", async (req, res) => {
    try {
        res.status(200).json({
            message: "Ok"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
});

// Import routes
import tokenRoutes from './routes/token.routes';
import webhookRoutes from './routes/webhook.route';

// Use routes
app.use('/api/token', tokenRoutes);
app.use('/api/webhook', webhookRoutes);

app.listen(3003, () => {
    console.log("server is running on port 3003");
})

// Schedule a task to hit the API every minute
const url = process.env.API_URL || 'http://localhost:3003/monitor';
