import app from './src/app'
import dotenv from 'dotenv'
import { connectDB } from './src/client';

dotenv.config({
    path:'../.env'
})

const PORT = process.env.PORT || 4000;





connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running on PORT ${PORT}`);
    })
    }
).catch((error)=>{
    console.log("connection error")
})