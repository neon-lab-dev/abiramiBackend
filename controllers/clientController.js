import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import z from "zod";

import prismadb from "../db/prismaDb.js";

const emailSchema = z.string().email();

// get all clients
export const getAllClients = catchAsyncErrors(async (req, res) => {
  try {
    const wehreClause={
      status: "ACTIVE"
    }

    const clients = await prismadb.client.findMany(
     { include:{
        invoice:true
      }}
    );
    const totalCount = await prismadb.client.count();
    const activeCount = await prismadb.client.count({
      where: wehreClause
    });
    const inactiveCount = totalCount - activeCount;
    return sendResponse(res, {
      status: 200,
      data: clients,
      totalCount: totalCount,
      activeCount: activeCount,
      inactiveCount: inactiveCount
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
      companyName, contactPerson, GST, mobileNum, landLineNum, email, addressLine1,
      addressLine2, addressLine3, city, pincode, state, country, status
    } = req.body;

    // error handling
    if (
      !companyName || !contactPerson || !GST || !mobileNum || !addressLine1 || !city || !pincode || !state || !country|| !status 
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
        companyName, contactPerson, GST, mobileNum, landLineNum, email, addressLine1,
        addressLine2, addressLine3, city, pincode, state, country, status,
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
      companyName, contactPerson, GST, mobileNum, landLineNum, email, addressLine1,
      addressLine2, addressLine3, city, pincode, state, country, status,
    } = req.body;

    // error handling
    if (
      !companyName || !contactPerson || !GST || !mobileNum || !addressLine1 || !status
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
        companyName, contactPerson, GST, mobileNum, landLineNum, email, addressLine1,
        addressLine2, addressLine3, city, pincode, state, country, status,
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
  const { mobileNum, address } = req.query;

  const whereClause = {
    OR: [
      mobileNum ? { mobileNum: { contains: mobileNum } } : undefined,
      address ? {
        OR: [
          { addressLine1: { contains: address } },
        ]
      } : undefined
    ].filter(Boolean)
  };

    const clients = await prismadb.Client.findMany({
      where: whereClause,
      include: {
        invoice: true // Include the invoice relation
      }
    }); 


//   const clients = await prismadb.$queryRaw`
//   SELECT * FROM Client 
//   WHERE 
//     mobileNum LIKE ${'%' + query + '%'} OR
//     addressLine1 LIKE ${'%' + query + '%'} OR
//     companyName LIKE ${'%' + query + '%'} OR
//     contactPerson LIKE ${'%' + query + '%'} OR
//     GST LIKE ${'%' + query + '%'} OR
//     status LIKE ${'%' + query + '%'}
// `;

    if(clients.length === 0){
      return sendResponse(res, {
        status: 404,
        error: "No clients found",
      });
    }

    // Ensure that clients with null invoices are handled
    const clientsWithInvoices = clients.map(client => ({
      ...client,
      invoice: client.invoice || [] // If invoice is null, set it to an empty array
    }));

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
      // totalCount: totalCount,
      // activeCount: activeCount,
      // inactiveCount: inactiveCount
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

    const client = await prismadb.client.findUnique({
      where: {
        id,
      },
      include: {
        invoice: true,
      },
    });

    if(!client){
      return sendResponse(res, {
        status: 404,
        error: "no, client not found",
      });
    }

    const totalInvoices = client.invoice.length;
    const paidInvoices = client.invoice.filter(inv => inv.billingStatus === "PAID").length;
    const pendingInvoices = client.invoice.filter(inv => inv.billingStatus === "PENDING").length;
    const totalIncome  = client.invoice.reduce((acc, inv) => acc + inv.totalAmount, 0);

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
      pendingInvoices: pendingInvoices
    });
});