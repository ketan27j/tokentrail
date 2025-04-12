import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from 'prisma-shared';
import { Pool } from 'pg';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

router.post("/helius-webhook", async (req, res) => {
    try {
        const response = JSON.stringify(req.body, null, 2);
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        let userId = 0;
        if(authHeader){
            userId = Number(authHeader);
            console.log('userId:', userId);
        }

        if (!response) {
            return res.status(400).json({ error: 'Invalid webhook payload' });
        }

        const userDb = await prisma.userPostgresDatabase.findFirst({
            where: {
                userId: userId,
            },
        });

        if (!userDb) {
            return res.status(404).json({ error: 'User database not found' });
        }

        const pool = new Pool({
            host: userDb.host,
            port: userDb.port,
            database: userDb.databaseName,
            user: userDb.userName,
            password: userDb.password,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        const client = await pool.connect();

        try {
            const query = `INSERT INTO "HeliusResponse" (response) VALUES ($1)`;
            await client.query(query, [response]);
            res.status(200).json({ success: true });
        } finally {
            client.release(); // Ensure the connection is released
        }
    } catch (error) {
        console.error('Error in /helius-webhook:', error);
        res.status(500).json({
            message: "Internal server error in webhook",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

export default router;