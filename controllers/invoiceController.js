import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";

import prismadb from "../db/prismaDb.js";

// get all invoices
export const getAllInvoices = catchAsyncErrors(async (req, res) => {
  try {
    const invoices = await prismadb.BillingDetails.findMany(
        {
            include: {
                productDetails: true
            }
        }
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

    const draftInvoices= totalInvoices - (paidInvoices + pendingInvoices);
    return sendResponse(res, {
      status: 200,
      data: invoices,
        paidInvoices: paidInvoices,
        pendingInvoices: pendingInvoices,
        draftInvoices: draftInvoices,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// create invoice
export const createInvoice = catchAsyncErrors(async (req, res) => {
  try {
    const { client , date , state , code , billingStatus , taxType , invoiceType , productDetails } = req.body;

    // error handling
    if (!client || !date || !state || !code || !billingStatus || !taxType || !invoiceType || !productDetails) {
      return sendResponse(res, {
        status: 400,
        error: "Please fill the required fields",
      });
    }

    const invoice = await prismadb.BillingDetails.create({
      data: {
        client,
        date,
        state,
        code,
        billingStatus,
        taxType,
        invoiceType,
        productDetails: {
            create: productDetails
        }
      },
    });

    return sendResponse(res, {
      status: 200,
      data: invoice,
      productDetails: productDetails
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});


// delete invoice
export const deleteInvoice = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "invoice Id is required",
      });
    }

    const invoice = await prismadb.BillingDetails.delete({
      where: {
        id,
      },
    });

    if (!invoice) {
      return sendResponse(res, {
        status: 404,
        error: "invoice not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: invoice,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});


// update invoice
export const updateInvoice = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "invoice Id is required",
      });
    }

    const {
        client , date , state , code , billingStatus , taxType , invoiceType , productDetails
    } = req.body;

    const invoice = await prismadb.BillingDetails.update({
      where: {
        id,
      },
      data: {
        client,
        date,
        state,
        code,
        billingStatus,
        taxType,
        invoiceType,
        productDetails: {
            create: productDetails
        }
      },
    });

    return sendResponse(res, {
      status: 200,
      data: invoice,
      productDetails: productDetails
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});


// get invoice by invoice type and id
export const searchInvoices = catchAsyncErrors(async (req, res) => {
    try {
      const { id, invoiceType } = req.query;
  
      const whereClause = {
        OR: [
            id && {
                id: {
              contains: id
            }
          },
          invoiceType && {
            OR: [
              { invoiceType: { contains: invoiceType } },
            ]
          }
        ].filter(Boolean)
      };
  
      const Invoices = await prismadb.BillingDetails.findMany({
        where: whereClause,
      });

      const totalInvoices = await prismadb.BillingDetails.count({
        where: whereClause
      });

      const paidInvoices = await prismadb.BillingDetails.count({
        where:
            {
                AND: [whereClause, { billingStatus: "PAID" }]
            }
      });
      const pendingInvoices = await prismadb.BillingDetails.count({
          where:
                {
                    AND: [whereClause, { billingStatus: "PENDING" }]
                }
      });
  
      const draftInvoices= totalInvoices - (paidInvoices + pendingInvoices);
  
      return sendResponse(res, {
        status: 200,
        data: Invoices,
        paidInvoices: paidInvoices,
        pendingInvoices: pendingInvoices,
        draftInvoices: draftInvoices
      });
  
    } catch (error) {
      return sendResponse(res, {
        status: 500,
        error: error.message
      });
    }
  });