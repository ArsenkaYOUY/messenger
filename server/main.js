import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());

// Подключение маршрутизатора аунтификации, авторизации и тп
app.use('/api/auth', authRouter );

// Подключение маршрутизатора функций всего что связано с конечным пользователем
app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})