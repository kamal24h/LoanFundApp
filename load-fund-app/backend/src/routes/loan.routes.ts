import { Router, Request, Response } from "express";
import prisma from "../config/prisma";
import { authMiddleware, adminOnly } from "../middleware/auth";

const router = Router();

// عضو درخواست وام می‌دهد
router.post("/requests", authMiddleware, async (req: Request, res: Response) => {
  const { loanProductId, requestedAmount } = req.body;

  const product = await prisma.loanProduct.findUnique({
    where: { id: loanProductId },
  });

  if (!product || !product.isActive) {
    return res.status(400).json({ message: "Invalid loan product" });
  }

  if (requestedAmount < product.minAmount || requestedAmount > product.maxAmount) {
    return res.status(400).json({ message: "Requested amount out of range" });
  }

  const requestLoan = await prisma.loanRequest.create({
    data: {
      userId: req.user!.userId,
      loanProductId,
      requestedAmount,
    },
  });

  res.json(requestLoan);
});

// ادمین همه درخواست‌ها را می‌بیند
router.get("/requests", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const requests = await prisma.loanRequest.findMany({
    include: {
      user: true,
      loanProduct: true,
    },
  });
  res.json(requests);
});

// ادمین تأیید می‌کند و وام می‌سازد
router.post("/requests/:id/approve", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { installmentsCount } = req.body;

  const requestLoan = await prisma.loanRequest.findUnique({
    where: { id: Number(id) },
    include: { loanProduct: true },
  });

  if (!requestLoan) {
    return res.status(404).json({ message: "Loan request not found" });
  }
  if (requestLoan.status !== "pending") {
    return res.status(400).json({ message: "Already processed" });
  }

  const interestRate = requestLoan.loanProduct.interestRate;
  const principal = requestLoan.requestedAmount;
  const totalAmount = principal + (principal * interestRate) / 100;

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + installmentsCount);

  const loan = await prisma.loan.create({
    data: {
      loanRequestId: requestLoan.id,
      userId: requestLoan.userId,
      principalAmount: principal,
      interestRate,
      totalAmount,
      installmentsCount,
      startDate,
      endDate,
    },
  });

  // ایجاد اقساط
  const installmentAmount = totalAmount / installmentsCount;
  const installmentsData = [];
  for (let i = 1; i <= installmentsCount; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);
    installmentsData.push({
      loanId: loan.id,
      installmentNumber: i,
      dueDate,
      amount: installmentAmount,
    });
  }
  await prisma.loanInstallment.createMany({
    data: installmentsData,
  });

  await prisma.loanRequest.update({
    where: { id: requestLoan.id },
    data: {
      status: "approved",
      decisionDate: new Date(),
    },
  });

  const fullLoan = await prisma.loan.findUnique({
    where: { id: loan.id },
    include: { installments: true },
  });

  res.json(fullLoan);
});

// لیست وام‌های خود کاربر
router.get("/my", authMiddleware, async (req: Request, res: Response) => {
  const loans = await prisma.loan.findMany({
    where: { userId: req.user!.userId },
    include: {
      installments: true,
      loanRequest: {
        include: {
          loanProduct: true,
        },
      },
    },
  });
  res.json(loans);
});

export default router;
