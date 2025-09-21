import { NextFunction, Request, Response } from "express";
import { SavingRepository } from "../infrastructure/savingRepoPrisma";
import {
  createSaving,
  deleteSaving,
  getSaving,
  updateSaving,
} from "../usecases/savingUseCases";
import { CreateSavingSchema } from "../validators/CreateSavingSchema";
import { CreateSavingDto } from "../models/dtos/CreateSavingDTO";
import { UpdateSavingSchema } from "../validators/updateSavingSchema";

const savingRepo = new SavingRepository();

export const createSavingHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = CreateSavingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const { name, targetAmount, targetDate } = parsed.data;
    const userId = req.userInfo?.id;

    const savingData: CreateSavingDto = {
      name,
      targetAmount,
      contributedAmount: 0,
      targetDate,
      userId,
    };

    const saving = await createSaving(savingData);

    res.status(201).json({
      status: "success",
      data: saving,
    });
  } catch (e) {
    next(e);
  }
};

export const updateSavingHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const savingId = Number(req.params.savingsId);
    const userId = req.userInfo?.id;

    if (!savingId || isNaN(savingId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid savings ID",
      });
    }

    const parsed = UpdateSavingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input",
        errors: parsed.error,
      });
    }

    const updateData = parsed.data;
    const updated = await updateSaving(savingId, userId, updateData);

    return res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavingsHandler = async (req: any, res: Response) => {
  try {
    const savings = await savingRepo.getAll(req.userInfo.id);

    res.status(200).json({
      status: "success",
      data: savings,
    });
  } catch (e) {
    console.log("GET SAVINGS HANDLER ERROR _> ❌", e);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

export const getSavingHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const savingsId = Number(req.params.savingsId);

    if (!savingsId) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid savings ID",
      });
    }

    const saving = await getSaving(savingsId, req.userInfo.id);

    return res.status(200).json({
      status: "success",
      data: saving,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteSavingHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const savingsId = Number(req.params.savingsId);

    if (!savingsId) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid savings ID",
      });
    }

    await deleteSaving(savingsId, req.userInfo.id);

    return res.status(204).json();
  } catch (e) {
    next(e);
  }
};
