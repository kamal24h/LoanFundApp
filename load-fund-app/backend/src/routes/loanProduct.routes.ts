import { Router, Request, Response } from "express";
import prisma from "../config/prisma";
import { authMiddleware, adminOnly } from "../middleware/auth";

const router = Router();

// همه کاربران می‌توانند لیست محصولات وام را ببینند
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const products = await prisma.loanProduct.findMany({
    where: { isActive: true },
  });
  res.json(products);
});

// فقط ادمین ایجاد می‌کند
router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { name, description, maxAmount, minAmount, interestRate, maxInstallments } = req.body;
  const product = await prisma.loanProduct.create({
    data: {
      name,
      description,
      maxAmount,
      minAmount,
      interestRate,
      maxInstallments,
    },
  });
  res.json(product);
});

export default router;
