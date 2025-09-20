import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';

import authRouter from './routers/auth.router.js';
import userRouter from './routers/user.router.js';
import recipeRouter from './routers/recipe.router.js';

const allowedOrigin = 'https://epiblog-flame.vercel.app'; 

const port = process.env.PORT;

const server = express();

server.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    credentials: true 
}));

server.use(morgan('tiny'));
server.use(express.json());

server.get('/api', (request, response) => {
    response.send('<h1>Questa è la nostra API</h1>');
});

server.use('/api/v1', authRouter);
server.use('/api/v1/users', userRouter);
server.use('/api/v1/recipes', recipeRouter);

server.use((error, request, response, next) => {
    console.error(error);
    const status = error.status || 500;
    response.status(status).send({
        message: error.message || 'Si è verificato un errore inaspettato.',
    });
});

server.use((request, response) => {
    response.status(404).send({ message: 'Risorsa non trovata.' });
});

await mongoose
    .connect(process.env.MONGODB_CONNECTION_URI)
    .then(() => console.log('Siamo connessi al database'))
    .catch((error) => {
        console.error('Errore di connessione al database:', error);
        process.exit(1);
    });

server.listen(port, () => {
    console.log(`Server avviato sulla porta ${port}`);
});
