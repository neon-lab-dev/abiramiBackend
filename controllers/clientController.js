import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import z from "zod";

import prismadb from "../db/prismaDb.js";

const emailSchema = z.string().email();

// get all clients
export const getAllClients = catchAsyncErrors(async (req, res) => {
  try {
    const clients = await prismadb.client.findMany();
    return sendResponse(res, {
      status: 200,
      data: clients,
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
      addressLine2, addressLine3, city, pincode, state, country, status,
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
