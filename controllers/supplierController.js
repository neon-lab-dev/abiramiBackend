import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import z from "zod";

import prismadb from "../db/prismaDb.js";

const emailSchema = z.string().email();

// get all suppliers
export const getAllSuppliers = catchAsyncErrors(async (req, res) => {
  try {
    const wehreClause = {
      status: "ACTIVE",
    };

    const suppliers = await prismadb.supplier.findMany();
    const totalCount = await prismadb.supplier.count();
    const activeCount = await prismadb.supplier.count({
      where: wehreClause,
    });
    const inactiveCount = totalCount - activeCount;
    return sendResponse(res, {
      status: 200,
      data: suppliers,
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

// get single supplier
export const getSingleSupplier = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return sendResponse(res, {
      status: 400,
      error: "supplier Id is required",
    });
  }

  const supplier = await prismadb.supplier.findUnique({
    where: {
      id,
    },
  });

  if (!supplier) {
    return sendResponse(res, {
      status: 404,
      error: "supplier not found",
    });
  }

  return sendResponse(res, {
    status: 200,
    data: supplier,
  });
});

// create supplier
export const createSupplier = catchAsyncErrors(async (req, res) => {
  try {
    const {
      companyName,
      title,
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
      !title ||
      !GST ||
      !mobileNum ||
      !addressLine1 ||
      !city ||
      !pincode ||
      !state ||
      !country ||
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

    const existingSupplier = await prismadb.supplier.findFirst({
      where: {
        AND: [{ companyName }, { mobileNum }],
      },
    });

    if (existingSupplier) {
      return sendResponse(res, {
        status: 409,
        error: "supplier already exists",
      });
    }

    const newSupplier = await prismadb.supplier.create({
      data: {
        companyName,
        title,
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
      data: newSupplier,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

//   delete supplier
export const deleteSupplier = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "clinet Id is required",
      });
    }

    const supplier = await prismadb.supplier.delete({
      where: {
        id,
      },
    });

    if (!supplier) {
      return sendResponse(res, {
        status: 404,
        error: "supplier not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: supplier,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

//   update supplier
export const updateSupplier = catchAsyncErrors(async (req, res) => {
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
      title,
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
      !title ||
      !GST ||
      !mobileNum ||
      !addressLine1 ||
      !status
    ) {
      return sendResponse(res, {
        status: 400,
        error: "Please fill the required fields",
      });
    }

    const supplier = await prismadb.supplier.update({
      where: {
        id,
      },
      data: {
        companyName,
        title,
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

    if (!supplier) {
      return sendResponse(res, {
        status: 404,
        error: "supplier not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: supplier,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// get supplier by mobile number and address
export const searchSuppliers = catchAsyncErrors(async (req, res) => {
  try {
    const { query } = req.query;

    let mobileNum = null;
    let address = null;

    if (!isNaN(query)) {
      mobileNum = query;
    } else {
      address = query;
    }

    const whereClause = {
      OR: [
        mobileNum && {
          mobileNum: {
            contains: mobileNum,
          },
        },
        address && {
          OR: [{ addressLine1: { contains: address } }],
        },
      ].filter(Boolean),
    };

    const Suppliers = await prismadb.Supplier.findMany({
      where: whereClause,
    });
    const totalCount = await prismadb.Supplier.count({
      where: whereClause,
    });
    const activeCount = await prismadb.Supplier.count({
      where: {
        AND: [whereClause, { status: "ACTIVE" }],
      },
    });
    const inactiveCount = totalCount - activeCount;

    return sendResponse(res, {
      status: 200,
      data: Suppliers,
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
