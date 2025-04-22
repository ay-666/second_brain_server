import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiResponse } from "../../utils/ApiResponse";
import client from "../client";
import { userInputType } from "../schemas/user.schema";

export const jwtVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtToken : string = req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ","") || "";
    if(!jwtToken){
        res.status(401).json(new ApiResponse(401,"Unauthorized access"));
        return;
    }
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await client.user.findFirst({
      omit:{
        password:true
      },
      where:{
        username : decoded.username
      }
    })

    if(!user){
      res.status(401).json(new ApiResponse(401, "Unauthorized Request"));
      return;
    }
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json(new ApiResponse(401, "Unauthorized Request"));
  }
};
