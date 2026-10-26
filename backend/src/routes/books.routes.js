import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import * as c from "../controllers/books.controller.js";

const router = Router();
router.get("/", asyncHandler(c.listBooks));
router.get("/:id", asyncHandler(c.getBook));
router.post("/", asyncHandler(c.createBook));
router.put("/:id", asyncHandler(c.updateBook));
router.delete("/:id", asyncHandler(c.deleteBook));
export default router;
