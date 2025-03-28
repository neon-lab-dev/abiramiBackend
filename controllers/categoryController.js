import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";

import prismadb from "../db/prismaDb.js";


// get categoires
export const getCategories = catchAsyncErrors(async (req, res) => {
  try {
    const categories = await prismadb.Category.findMany(
        {
            include: {
                inventory: {
                  include: {
                    image: true
                  }
                }
            }
        }
    );

    return sendResponse(res, {
      status: 200,
      data: categories,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// get inventories
export const getInventoriesByCategory = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prismadb.Category.findUnique({
      where: {
        id: id
      },
      include: {
        inventory:{
          include: {
            image: true
          }
        }
      }
    });

    if (!category) {
      return sendResponse(res, {
        status: 404,
        error: "Category not found"
      });
    }

    return sendResponse(res, {
      status: 200,
      data: category
    });

  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message
    });
  }
});

// create category
export const createCategory = catchAsyncErrors(async (req, res) => {
  try {
    const { name , inventory } = req.body;
    console.log(inventory)

    if (!name || !inventory) {
      return sendResponse(res, {
        status: 400,
        error: "Please fill the required fields",
      });
    }

    const existingCategory = await prismadb.Category.findFirst({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return sendResponse(res, {
        status: 400,
        error: "Category already exists",
      });
    }

    const category = await prismadb.Category.create({
      data: {
        name,
        inventory:{
          create: inventory
        }
      },
    });

    return sendResponse(res, {
      status: 201,
      data: category,
      inventory: inventory
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// search category
export const searchCategory = catchAsyncErrors(async (req, res) => {
  try {
    const { query } = req.query;

    const category = await prismadb.Category.findMany({
      where: {
        name: {
          contains: query,
        }
      },
      include: {
        inventory: true
      }
    });

    return sendResponse(res, {
      status: 200,
      data: category
    });

  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message
    });
  }
});

// delete category
export const deleteCategory = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "Category Id is required",
      });
    }

    const category = await prismadb.Category.delete({
      where: {
        id,
      },
    });

    if (!category) {
      return sendResponse(res, {
        status: 404,
        error: "Category not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: category,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});