import { ApiError } from "../../utils/ApiError";
import { Request, Response } from "express";
import client from "../client";
import { ApiResponse } from "../../utils/ApiResponse";
import { Prisma, ContentTypes } from "@prisma/client";

export const addNewContent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const link: string = req.body?.link || "";

    const type: ContentTypes = req.body?.type || ContentTypes.article;

    const title: string = req.body?.title || "";

    const tags: string[] = req.body?.tags || [];

    if (!link || !type) {
      res.status(409).json(new ApiError(409, "Inputs missing..."));
      return;
    }

    const content = await client.content.create({
      data: {
        type: type,
        link: link,
        //@ts-ignore
        userId: req.user.id,
        title: title,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { title: tag },
            create: { title: tag },
          })),
        },
      },
    });

    //const newContent = await generateTag(content.id,)

    res.status(200).json(new ApiResponse(200, content, "New content created"));
  } catch (error) {
    let message = "Server Error";
    if (error instanceof Error) message = error.message;

    res.status(500).json(new ApiError(500, message));
  }
};

export const getAllContents = async (req: Request, res: Response) => {
  try {
    const allContents = await client.content.findMany({
      where: {
        //@ts-ignore
        userId: req.user.id,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        tags: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, allContents, "contents fetched success"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error fetching contents"));
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const contentId = req.body?.contentId || "";
    if (!contentId) {
      res.status(409).json(new ApiError(409, "Error in inputs"));
      return;
    }

    const content = await client.content.findFirst({
      where: {
        id: contentId,
      },
    });

    //@ts-ignore
    if (!content || content.userId !== req.user.id) {
      res.status(404).json(new ApiError(404, "content not found!"));
    }

    await client.content.delete({
      where: {
        id: contentId,
      },
    });

    res.status(200).json(new ApiResponse(200, {}, "content deleted success"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error deleting content."));
  }
};
