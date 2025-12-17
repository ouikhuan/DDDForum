import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users';

const app = express();
app.use(express.json());
app.use(cors());

// Mount routes
app.use('/users', usersRouter);

export default app;
