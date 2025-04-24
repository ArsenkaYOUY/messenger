import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';

import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

const PORT = 3000;

app.use(cookieParser());

app.use(express.json());

app.use(cors( {
    origin: 'http://localhost:63342',
    credentials: true,
}));

// Подключение маршрутизатора аунтификации, авторизации и тп
app.use('/api/auth', authRouter );

// Подключение маршрутизатора функций всего что связано с конечным пользователем
app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})