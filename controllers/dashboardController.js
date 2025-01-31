import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";

import prismadb from "../db/prismaDb.js";

const getDashboardData = catchAsyncErrors(async (req, res) => {
  const year = 2024;
  
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  );

  const totalInvoices = await prismadb.BillingDetails.count();

  const paidInvoices = await prismadb.BillingDetails.count({
    where: {
      billingStatus: "PAID",
    },
  });
  const pendingInvoices = await prismadb.BillingDetails.count({
    where: {
      billingStatus: "PENDING",
    },
  });

  const totalPaidAmount = await prismadb.BillingDetails.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      billingStatus: "PAID",
      date: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });

  const totalInvoicesThisMonth = await prismadb.BillingDetails.count({
    where: {
      date: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
  });
});
