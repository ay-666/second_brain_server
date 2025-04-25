import client from "../client";
import { Request, Response, NextFunction, CookieOptions } from "express";
import { ErrorTypes } from "../types";
import { userSchema, userInputType } from "../schemas/user.schema";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  let { username, password } = req.body;
  if (!username || !password) {
    res.status(411).json(new ApiError(411, "Error in inputs"));
    return;
  }

  const validatedData = userSchema.safeParse({
    username: username,
    password: password,
  });

  if (!validatedData.success) {
    const zodErrors = validatedData?.error?.errors[0]?.message;

    res.status(411).json(new ApiError(411, zodErrors || "Error in inputs"));
    return;
  }

  try {
    const userInput: userInputType = validatedData.data;
    userInput.password = await bcrypt.hash(userInput.password, 10);

    const existingUser = await client.user.findFirst({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      res
        .status(403)
        .json(new ApiError(403, " User already exists with this username"));
      return;
    }
    await client.user.create({
      data: userInput,
    });

    res.status(200).json(new ApiResponse(200,{},"User registered successfully."));
    return;
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal Server Error"));
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(411).json(new ApiError(411, "Error in inputs"));
    return;
  }

  const validatedData = userSchema.safeParse({
    username: username,
    password: password,
  });

  if (!validatedData.success) {
    const zodErrors = validatedData?.error?.errors[0]?.message;

    res.status(403).json(new ApiError(411, "Wrong email password"));
    return;
  }

  try {
    const userInput: userInputType = {
      username: username,
      password: password,
    };

    const existingUser = await client.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!existingUser) {
      res.status(403).json(new ApiError(411, "Wrong email password"));
      return;
    }
    
    const isMatch = await bcrypt.compare(
      userInput.password,
      existingUser.password
    );

    if (!isMatch) {
      res.status(403).json(new ApiError(411, "Wrong email password"));
      return;
    }

    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    const isProd = process.env.NODE_ENV ? process.env.NODE_ENV === 'production' : true ;

    const cookieOptions: Readonly <CookieOptions> = {
      httpOnly: true,
      secure:isProd
    }

    res.status(200).cookie("jwt",token,cookieOptions).json(new ApiResponse(200,{
      "token": token,
      user:{
        id:existingUser.id,
        username:existingUser.username
      }
    },"Login Success"));
    
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal Server Error"));
    return;
  }

};

export const signOutUser = async (req:Request, res:Response, next:NextFunction) =>{
  try{
    const cookieOptions : CookieOptions = {
      httpOnly:true,
      secure:true
    }
    res.status(200).clearCookie('jwt',cookieOptions).json(new ApiResponse(200,{},"Logout Success"))
  }catch(error){
    res.status(500).json(new ApiError(500,"Server Error"))
  }
}

export const checkUser = async(req:Request,res:Response)=>{
  //@ts-ignore
  const user = req?.user;

  if(!user){
    res.status(404).json(new ApiError(404,"Invalid user"))
    return;
  }
  res.status(200).json(new ApiResponse(200,user,"User exists"))
}