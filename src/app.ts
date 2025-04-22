import express,{urlencoded} from 'express';
import cors from 'cors';
import UserRouter from './routes/user.routes'
import ContentRouter from './routes/content.routes'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin:'*',
    credentials:true
}));

app.use(express.json());

app.use(urlencoded({extended:true}));

app.use(cookieParser())



//User Routes

app.use('/api/v1/user',UserRouter);


// Content Routes

app.use('/api/v1/content',ContentRouter);
export default app ;