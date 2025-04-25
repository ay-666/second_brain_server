import express,{urlencoded} from 'express';
import cors from 'cors';
import UserRouter from './routes/user.routes'
import ContentRouter from './routes/content.routes'
import LinkRouter from './routes/link.routes'
import cookieParser from 'cookie-parser'

const app = express();
const allowedOrigin = process.env.FRONTEND_URL ?? 'http://localhost:5173';
app.use(cors({
    origin:allowedOrigin,
    credentials:true
}));

app.use(express.json());

app.use(urlencoded({extended:true}));

app.use(cookieParser())



//User Routes

app.use('/api/v1/user',UserRouter);


// Content Routes

app.use('/api/v1/content',ContentRouter);

// Link Routes

app.use('/api/v1/brain',LinkRouter);

export default app ;