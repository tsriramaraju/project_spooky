import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { ResourceNotFoundError, TamperedRequestError } from "../../errors";
import { validateRequest } from "../../middlewares";
import { toggleUpvote } from "../../services";
import { userIdValidation } from "../../validators";

const router = Router();

/**
 *  @desc      Toggles comment vote
 *  @route     PUT /api/v1/comments/:id
 *  @access    Public
 *  @returns   toggle status
 */

export const toggleVoteController = async (req: Request, res: Response) => {
  const { id, replyId } = req.params;
  const { userId } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    throw new TamperedRequestError("Invalid comment id");
  }

  if (replyId && !Types.ObjectId.isValid(replyId)) {
    throw new TamperedRequestError("Invalid reply id");
  }

  const status = await toggleUpvote({ commentId: id, userId, replyId });

  if (typeof status === "string") throw new ResourceNotFoundError(status);

  res.status(201).json(status);
};

router.put("/:id/:replyId", [userIdValidation, validateRequest], toggleVoteController);
router.put("/:id", [userIdValidation, validateRequest], toggleVoteController);

export { router as toggleVoteRouter };
