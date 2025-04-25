import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { random } from "../../utils/random";
import client from "../client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export const createSharableLink = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.user.id;
    //@ts-ignore
    const username = req.user.username;

    const share: boolean = req.body?.share || false;

    const brain_details = await client.link.findFirst({
      where: {
        userId: userId,
      },
    });

    if (brain_details) {

      await client.link.delete({
        where:{
            id:brain_details.id
        }
      })
    }
    
    

    if (!share) {
      res.status(200).json(new ApiResponse(200,{} ,"share link removed"));
      return;
    }

    const hashedString: string = random(10);
    const shareLink = await client.link.create({
      data: {
        hash: hashedString,
        userId: userId,
      },
    });
    //const fullShareURL = `${process.env.BASE_URL}brain/${hashedString}`;
    res.status(200).json(
      new ApiResponse(
        200,
        {
          hashString: hashedString,
        },
        "share link creation success"
      )
    );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error while creating link"));
  }
};

export const getUserSharedBrain = async (req: Request, res: Response) => {
  try {
    const hashedString = req.params.hashedString || "";
    //console.log(hashedString)
    if (!hashedString) {
      res.status(404).json(new ApiError(404, "Invalid link"));
      return;
    }

    const brain_details = await client.link.findFirst({
      where: {
        hash: hashedString,
      },
      select: {
        user: {
          select: {
            username: true,
            contents: {
              omit: {
                userId: true,
              },
            },
          },
        },
      },
    });
    if (!brain_details) {
      res.status(404).json(new ApiError(404, "Invalid link"));
      return;
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, brain_details?.user, "Details fetched success.")
      );
  } catch (error) {
    let message = "Error while fetching link";
    if (error instanceof Error) message = error.message;
    res.status(500).json(new ApiError(500, message));
  }
};
