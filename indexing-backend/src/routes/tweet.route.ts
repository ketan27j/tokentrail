import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from 'prisma-shared';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

router.post("/search-tweet", async (req, res) => {
    try {
        const response = JSON.stringify(req.body, null, 2);
        // const authHeader = req.headers.authorization;
        // if(!authHeader){
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }
        let userId = 0;
        // if(authHeader){
        //     userId = Number(authHeader);
        //     console.log('userId:', userId);
        // }

        const userDb = await prisma.tweet.findFirst({
            where: {
                userId: userId,
            },
        });

        if (!userDb) {
            return res.status(404).json({ error: 'User database not found' });
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