import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import * as c from "../controllers/transactions.controller.js";

const router = Router();
router.get("/", asyncHandler(c.listTransactions));
router.post("/", asyncHandler(c.createTransaction));
export default router;
