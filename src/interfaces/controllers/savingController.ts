import { Request, Response } from "express";
import { SavingRepository } from "../../infrastructure/savingRepoPrisma";
import {
  createSaving,
  deleteSaving,
  getSaving,
  updateSaving,
} from "../../usecases/savingUseCases";
import { CreateSavingSchema } from "../../validators/CreateSavingSchema";
import { CreateSavingDto } from "../../domain/dtos/CreateSavingDTO";
import { UpdateSavingSchema } from "../../validators/updateSavingSchema";

const savingRepo = new SavingRepository();

export const createSavingHandler = async (req: any, res: Response) => {
  try {
    const parsed = CreateSavingSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const { name, targetAmount, contributedAmount, targetDate } = parsed.data;
    const userId = req.userInfo?.id;

    const savingData: CreateSavingDto = {
      name,
      targetAmount,
      contributedAmount,
      targetDate,
      userId,
    };

    const saving = await createSaving(savingData);

    if (!saving) {
      return res.status(400).json({
        status: "fail",
        message:
          "Something went wrong while creating your savings goal please try again later",
      });
    }

    res.status(201).json({
      status: "successs",
      data: saving,
    });
  } catch (e) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

export const updateSavingHandler = async (req: any, res: Response) => {
  try {
    const savingId = Number(req.params.savingsId);
    const userId = req.userInfo?.userId;

    if (!savingId || isNaN(savingId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid savings ID",
      });
    }

    // ✅ Validate with Zod
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

    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Saving goal not found or not authorized",
      });
    }

    return res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE SAVING ERROR ❌", error);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
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

export const getSavingHandler = async (req: any, res: Response) => {
  try {
    const { savingsId } = req.params;

    const convertedSavingsId = Number(savingsId);
    if (!convertedSavingsId) {
      return res.status(400).json({
        status: "fail",
        message: `Please provide a correct savings id`,
      });
    }
    const saving = await getSaving(convertedSavingsId, req.userInfo.id);

    if (!saving) {
      return res.status(404).json({
        status: "fail",
        message: `Savings with the Id ${savingsId} not found`,
      });
    }

    return res.status(200).json({
      status: "success",
      data: saving,
    });
  } catch (e) {
    console.log("GET SAVING HANDLER ERROR _> ❌", e);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

export const deleteSavingHandler = async (req: any, res: Response) => {
  try {
    const savingsId = req.params.savingsId;

    const convertedSavingsId = Number(savingsId);
    if (!convertedSavingsId) {
      return res.status(400).json({
        status: "fail",
        message: `Please provide a correct savings id`,
      });
    }

    console.log(convertedSavingsId);
    const result = await deleteSaving(convertedSavingsId, req.userInfo.id);

    if (!result) {
      return res.status(400).json({
        status: "fail",
        message: `Something went wrong trying to delete your savings goal`,
      });
    }

    res.status(204).json();
  } catch (e) {
    console.log("GET SAVING HANDLER ERROR _> ❌", e);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong",
    });
  }
};
