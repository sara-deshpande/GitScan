import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigins = [
    'https://git-scan-lake.vercel.app',
    'http://localhost:3000'
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.post('/api/analyze', async (req,res)=> {
    const {prompt} = req.body;

    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method : 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
            },

            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{role: 'user', content: prompt }],
                max_tokens:1500
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.status(500).json({error: 'Something went wrong'});
    }
});

export default app;