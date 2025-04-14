import express, { json } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from 'prisma-shared';
import axios from 'axios';
import { Tweet } from 'prisma-shared';
import fs from 'fs';
import path from 'path';
import { LlmService } from '../service/llmService';

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
        // console.log('Response:', response.data);
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
                  keyword: searchString
                }
            });
            console.log(`Imported tweet: ${tweet.tweet_id}`);
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

router.post("/analyze-pending-tweets", async (req, res) => {
    try {
        const pendingTweets = await prisma.tweet.findMany({
            where: {
                isAnalyzed: false,
            }
        });
        console.log('Pending Tweets:', pendingTweets);
        for (const tweet of pendingTweets) {
            await analyzeTweet(tweet.id, tweet.text);
            console.log(`Analyzed tweet: ${tweet.tweet_id}`);
            // Add a delay of 10 seconds before the next iteration
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
        res.status(200).json({
            message: "Pending tweets retrieved successfully",
            pendingTweets: pendingTweets,
        });
    } catch (error) {
        console.error('Error in /anlyze-pending-tweets:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

router.post("/analyze-tweet", async (req, res) => {
    try {
        const { tweetId, tweetText } = req.body;
        
        await analyzeTweet(tweetId, tweetText);
        res.status(200).json({
            message: "Tweet analyzed successfully",
        });
    } catch (error) {
        console.error('Error in /analyze-tweet:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

async function analyzeTweet(tweetId: number,tweetText: string): Promise<any> {
    try{
        const llmService = new LlmService();
        const tokenDetails = await llmService.analyzeTweet(tweetText);
        let isPresale = false;
        console.log('Token Details:', tokenDetails);
        if (tokenDetails.tokenTicker) {
            isPresale = true;
            await prisma.tokenDetail.upsert({
                where: { tokenTicker: tokenDetails.tokenTicker }, // Assuming tokenDetails contains a 'tokenTicker' field
                update: {
                ...tokenDetails,
                },
                create: {
                ...tokenDetails,
                },
            });
        } 
        console.log('tweetId:', tweetId);
        await prisma.tweet.update({
            where: { id: tweetId },
            data: {
                isAnalyzed: true,
                isPresale: isPresale,
                updatedAt: new Date()
            }
        });
    } catch (error) {
        console.error('Error analyzing tweet:', error);
        throw error;
    }   
}

export default router;