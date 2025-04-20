import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import z from "zod";

import prismadb from "../db/prismaDb.js";

const emailSchema = z.string().email();

// get all clients
export const getAllClients = catchAsyncErrors(async (req, res) => {
  try {
    const whereClause = {
      status: "ACTIVE",
    };

    const clients = await prismadb.client.findMany({
      include: {
        invoice: true,
      },
      orderBy: {
        createdAt: 'desc', // Add explicit ordering to avoid issues
      },
    });

    const totalCount = await prismadb.client.count();
    const activeCount = await prismadb.client.count({
      where: whereClause,
    });
    const inactiveCount = totalCount - activeCount;

    return sendResponse(res, {
      status: 200,
      data: clients,
      totalCount: totalCount,
      activeCount: activeCount,
      inactiveCount: inactiveCount,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});
// create client
export const createClient = catchAsyncErrors(async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      GST,
      mobileNum,
      landLineNum,
      email,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      pincode,
      state,
      country,
      status,
    } = req.body;

    // error handling
    if (
      !companyName ||
      !GST ||
      !mobileNum ||
      !status
    ) {
      return sendResponse(res, {
        status: 400,
        error: "Please fill the required fields",
      });
    }

    if (email) {
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) {
        return sendResponse(res, {
          status: 400,
          error: "Invalid email",
        });
      }
    }

    const existingClient = await prismadb.client.findFirst({
      where: {
        AND: [{ companyName }, { mobileNum }],
      },
    });

    if (existingClient) {
      return sendResponse(res, {
        status: 409,
        error: "Client already exists",
      });
    }

    const newClient = await prismadb.client.create({
      data: {
        companyName,
        contactPerson,
        GST,
        mobileNum,
        landLineNum,
        email,
        addressLine1,
        addressLine2,
        addressLine3,
        city,
        pincode,
        state,
        country,
        status,
      },
    });
    return sendResponse(res, {
      status: 201,
      data: newClient,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// delete client
export const deleteClient = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "clinet Id is required",
      });
    }

    const client = await prismadb.client.delete({
      where: {
        id,
      },
    });

    if (!client) {
      return sendResponse(res, {
        status: 404,
        error: "Client not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: client,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// update client
export const updateClient = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "clinet Id is required",
      });
    }

    const {
      companyName,
      contactPerson,
      GST,
      mobileNum,
      landLineNum,
      email,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      pincode,
      state,
      country,
      status,
    } = req.body;

    // error handling
    if (
      !companyName ||
      !GST ||
      !mobileNum ||
      !status
    ) {
      return sendResponse(res, {
        status: 400,
        error: "Please fill the required fields",
      });
    }

    const client = await prismadb.client.update({
      where: {
        id,
      },
      data: {
        companyName,
        contactPerson,
        GST,
        mobileNum,
        landLineNum,
        email,
        addressLine1,
        addressLine2,
        addressLine3,
        city,
        pincode,
        state,
        country,
        status,
      },
    });

    if (!client) {
      return sendResponse(res, {
        status: 404,
        error: "Client not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: client,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// get client by mobile number and address
export const searchClients = catchAsyncErrors(async (req, res) => {
  const { query } = req.query;


  const whereClause = {
    OR: [
      query && {
        OR: [
          { companyName: { contains: query } },
          {mobileNum: { contains: query } },
        ]
      }
    ].filter(Boolean)
  };

  const clients = await prismadb.Client.findMany({
    where: whereClause,
    include: {
      invoice: true, // Include the invoice relation
    },
  });


  if (clients.length === 0) {
    return sendResponse(res, {
      status: 404,
      error: "No clients found",
    });
  }

  // const totalCount = await prismadb.client.count({
  //   where: whereClause,
  // });

  // const activeCount = await prismadb.client.count({
  //   where: {
  //     AND: [whereClause, { status: "ACTIVE" }]
  //   },
  // });

  // const inactiveCount = totalCount - activeCount;

  return sendResponse(res, {
    status: 200,
    data: clients, // Use the modified clients array
  });
});

// Get single client
export const getSingleClient = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return sendResponse(res, {
      status: 400,
      error: "Client Id is required",
    });
  }

  const client = await prismadb.client.findFirst({
    where: {
      id,
    },
    include: {
      invoice: true,
    },
  });

  if (!client) {
    return sendResponse(res, {
      status: 404,
      error: "no, client not found",
    });
  }

  const totalInvoices = client.invoice.length;
  const paidInvoices = client.invoice.filter(
    (inv) => inv.billingStatus === "PAID"
  ).length;
  
  const pendingInvoices = client.invoice.filter(
    (inv) => inv.billingStatus === "PENDING"
  ).length;
  const totalIncome = client.invoice.reduce(
    (acc, inv) => acc + inv.totalAmount,
    0
  );

  if (!client) {
    return sendResponse(res, {
      status: 404,
      error: "Client not found",
    });
  }

  return sendResponse(res, {
    status: 200,
    data: client,
    totalIncome: totalIncome,
    totalInvoices: totalInvoices,
    paidInvoices: paidInvoices,
    pendingInvoices: pendingInvoices,
  });
});
