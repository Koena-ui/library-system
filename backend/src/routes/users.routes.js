import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import * as c from "../controllers/users.controller.js";

const router = Router();
router.post("/login", asyncHandler(c.login));
router.get("/", asyncHandler(c.listUsers));
router.post("/", asyncHandler(c.createUser));
router.put("/:id", asyncHandler(c.updateUser));
router.delete("/:id", asyncHandler(c.deleteUser));
export default router;
