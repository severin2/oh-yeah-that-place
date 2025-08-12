import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { searchRouter } from './routes/search';
import { placeNoteRouter } from './routes/placeNoteRest';

export const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// REST API routes
app.use('/search', searchRouter);
app.use('/api/place-notes', placeNoteRouter);

export const start = () => {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};
