import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(cors());

// Mount routes
app.use('/users', usersRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
