import { ApiError } from "../../utils/ApiError";
import { Request, Response } from "express";
import client from "../client";
import { ApiResponse } from "../../utils/ApiResponse";
import { Prisma, ContentTypes } from "@prisma/client";


export const addNewContent = async(req:Request,res:Response) =>{
    try{
        // @ts-ignore
        const link : string = req.body?.link || "";
        
        const type: ContentTypes = req.body?.type || ContentTypes.article;

        const title = req.body?.title || "";

        if(!link || !type){

            res.status(409).json(new ApiError(409,"Inputs missing..."));
            return;
        }

       const newContent = await client.content.create({
            data:{
                type:type,
                link:link,
                //@ts-ignore
                userId: req.user.id,
                title:title
            }
        })

        res.status(200).json(new ApiResponse(200,newContent,"New content created"));
    } catch(error){
        let message = "Server Error";
        if(error  instanceof Error)
            message = error.message;

        res.status(500).json(new ApiError(500,message));
        
    }
}