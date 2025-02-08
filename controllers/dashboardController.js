import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import formatDate from "../utils/formatDate.js";

import prismadb from "../db/prismaDb.js";

export const getDashboardData = catchAsyncErrors(async (req, res) => {

  const year = new Date().getFullYear();
  // console.log("year", year)

  const startOfMonth = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 0))

  const endOfMonth = formatDate(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0))

  const startofYear = formatDate(new Date(`${year}-01-01T00:00:00.000Z`));
  const endofYear = formatDate(new Date(`${year + 1}-01-01T00:00:00.000Z`));

  console.log("start and end of the month", startOfMonth, endOfMonth)
  console.log("start and end of year", startofYear, endofYear)

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

  const incomeReceivedFY = await prismadb.BillingDetails.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      billingStatus: "PAID",
      date: {
        gte: startofYear,
        lt: endofYear
      },
    },
  });


  const totalPurchaseReceivedFY= await prismadb.Purchase.aggregate({
    _sum: {
        totalPurchaseAmt: true,
    },
    where: {
      date: {
        gte: startofYear,
        lt: endofYear
      },
    },
  });

  const totalInvoicesThisMonth = await prismadb.BillingDetails.count({
    where: {
      date: {
        gte: startOfMonth,
        lt: endOfMonth
      },
    },
  });

  const salesThisMonth= await prismadb.BillingDetails.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      date: {
        gte: startOfMonth,
        lt: endOfMonth
      },
    },
  });

  const purchaseThisMonth = await prismadb.Purchase.aggregate({
    _sum: {
        totalPurchaseAmt: true,
    },
    where: {
      date: {
        gte: startOfMonth,
        lt: endOfMonth
      },
    },
  });

  return sendResponse(res, {
    status: 200,
    data: {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      incomeReceivedFY: incomeReceivedFY._sum.totalAmount || 0,
      totalPurchaseReceivedFY: totalPurchaseReceivedFY._sum.totalPurchaseAmt || 0,
      totalInvoicesThisMonth,
      salesThisMonth: salesThisMonth._sum.totalAmount || 0,
      purchaseThisMonth: purchaseThisMonth._sum.totalPurchaseAmt || 0,
    },
  });
});



export const getSalesAndPurchase = async (req, res) => {

  const year = new Date().getFullYear();

  const startofYear = formatDate(new Date(`${year}-01-01T00:00:00.000Z`));
  const endofYear = formatDate(new Date(`${year + 1}-01-01T00:00:00.000Z`));

  // Fetch all sales records for the year
  const sales = await prismadb.BillingDetails.findMany({
    where: {
      date: {
        gte: startofYear,
        lt: endofYear
      },
      billingStatus: "PAID",
    },
  });

  // Fetch all purchase records for the year
  const purchase = await prismadb.Purchase.findMany({
    where: {
      date: {
        gte: startofYear,
        lt: endofYear
      },
    },
  });

  // Group sales and purchase by month
  const salesByMonth = Array(12).fill(0);
  const purchaseByMonth = Array(12).fill(0);

  sales.forEach((sale) => {
    const month = new Date(sale.date).getMonth(); // getMonth() returns 0-11
    salesByMonth[month]++;
  });

  purchase.forEach((p) => {
    const month = new Date(p.date).getMonth();
    purchaseByMonth[month]++;
  });

  return sendResponse(res, {
    status: 200,
    data: {
      sales: salesByMonth,
      purchase: purchaseByMonth,
    },
  });
};