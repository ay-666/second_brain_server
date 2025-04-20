import { PrismaClient } from "@prisma/client";

let client = new PrismaClient();

export const connectDB = async()=>{
    try{
        await client.$connect();
        console.log('Prisma db connection established');
    }catch(error){
        console.error('Prisma db connection failed.',error)
        process.exit(1);
    }
}


export default client;