import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { initDB } from './services/db';
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import questionRoutes from './routes/questionRoutes';
import answerRoutes from './routes/answerRoutes';
import dailyQuestionRoutes from './routes/dailyQuestionRoutes';
import { startDailyQuestionCron } from './services/cron';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/daily-questions', dailyQuestionRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

initDB()
  .then(() => {
    startDailyQuestionCron();
    app.listen(port, () => {
      console.log(`Back-end running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('DB initialization failed', error);
    process.exit(1);
  });
