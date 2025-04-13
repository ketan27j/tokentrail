import express, { json } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from 'prisma-shared';
import axios from 'axios';
import { Tweet } from 'prisma-shared';
import fs from 'fs';
import path from 'path';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

router.post("/search-tweet", async (req, res) => {
    try {
        const {searchString} = req.body;
        // const authHeader = req.headers.authorization;
        // if(!authHeader){
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }
        // let userId = 0;
        // if(authHeader){
        //     userId = Number(authHeader);
        //     console.log('userId:', userId);
        // }

        // const userDb = await prisma.user.findFirst({
        //     where: {
        //         id: userId,
        //     },
        // });

        // if (!userDb) {
        //     return res.status(404).json({ error: 'User database not found' });
        // }
        console.log(process.env.RAPIDAPI_KEY);   
        const response = await axios.get('https://twitter-api45.p.rapidapi.com/search.php', {
            params: {
                query: searchString,
                search_type: 'Top'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
                'x-rapidapi-host': 'twitter-api45.p.rapidapi.com'
            }
        });
        console.log('Response:', response.data);
        const twitterData = response.data;
        // const rawData = fs.readFileSync(path.resolve('../tweets.json'), 'utf8');
        // const twitterData = JSON.parse(rawData);
        for(const tweet of twitterData.timeline as Tweet[])
        {           
            // Check if tweet already exists to avoid duplicates
            const existingTweet = await prisma.tweet.findUnique({
                where: { tweet_id: tweet.tweet_id }
            });
            
            if (existingTweet) {
                console.log(`Tweet ${tweet.tweet_id} already exists, skipping`);
                continue;
            }
            await prisma.tweet.create({
                data: {
                  tweet_id: tweet.tweet_id,
                  type: tweet.type,
                  userId : 1,
                  screen_name: tweet.screen_name,
                  bookmarks: tweet.bookmarks,
                  favorites: tweet.favorites,
                  created_at: new Date(tweet.created_at),
                  text: tweet.text,
                  lang: tweet.lang,
                  quotes: tweet.quotes,
                  replies: tweet.replies,
                  retweets: tweet.retweets,
                }
            });
            // Store the cursor for future pagination
            await prisma.cursor.upsert({
                where: { id: 1 },
                update: { value: twitterData.next_cursor },
                create: { id: 1, value: twitterData.next_cursor }
            });  
        }
        res.status(200).json({
            message: "Ok",
        });
    } catch (error) {
        console.error('Error in /search-tweet:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

export default router;