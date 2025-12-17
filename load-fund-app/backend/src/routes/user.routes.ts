import { Router, Request, Response } from "express";
import prisma from "../config/prisma";
import { authMiddleware, adminOnly } from "../middleware/auth";

const router = Router();

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  res.json(user);
});

router.get("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  res.json(users);
});

export default router;
