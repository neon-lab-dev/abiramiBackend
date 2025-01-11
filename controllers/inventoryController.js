import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import { uploadImage } from "../utils/uploadImage.js";
import getDataUri from "../utils/getUri.js";

import prismadb from "../db/prismaDb.js";


// get inventory item details
export const getItemDetails = catchAsyncErrors(async (req, res) => {
  try {
    // Get total quantity across all inventory
    const totalQuantity = await prismadb.inventory.aggregate({
      _sum: {
        quantity: true
      }
    });

    // Get low stock count
    const lowStock = await prismadb.inventory.count({
      where: {
        quantity: {
          lt: 10 
        }
      }
    });

    // Get out of stock count
    const outOfStock = await prismadb.inventory.count({
      where: {
        quantity: {
          equals: 0
        }
      }
    });

    return sendResponse(res, {
      status: 200,
      data: {
        totalQuantity: totalQuantity._sum.quantity || 0,
        lowStock: lowStock || 0,
        outOfStock: outOfStock || 0
      }
    });

  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message
    });
  }
});

// create inventory
export const createInventory = catchAsyncErrors(async (req, res) => {
    try {
      const { refrence , buyingCost , quantity , description , sellingCost , warehouseLocation , quantityType , alarm , catgoryId } = req.body;
     console.log(req.body)
      // error handling
      if (!refrence || !buyingCost  || !quantity || !description || !sellingCost || !warehouseLocation || !quantityType || !alarm || !catgoryId) {
        return sendResponse(res, {
          status: 400,
          error: "Please fill the required fields",
        });
      }

        if (!req.file) {
          return sendResponse({
              res: 400,
              error: "Please upload an image file."
          });
        }

        const existingInventory = await prismadb.Inventory.findFirst({
          where: {
            AND: [{ refrence }, { quantity: parseInt(quantity) } , {quantityType}],
          },
        });
        
        if (existingInventory) {
          return sendResponse(res, {
            status: 400,
            error: "Inventoroy already exists",
          });
        }

      const image = await uploadImage(
        getDataUri(req.file).content,
        getDataUri(req.file).fileName,
        "inventory"
      );
      if (!image) {
        return sendResponse({
          res: 500,
          error: "Failed to upload image."
        });
      }
  
  
      const inventory = await prismadb.Inventory.create({
        data: {
            refrence ,
            buyingCost: parseInt(buyingCost) , 
            quantity: parseInt(quantity) , 
            description , 
            sellingCost: parseInt(sellingCost) , 
            warehouseLocation , 
            quantityType , 
            alarm:parseInt(alarm) , 
            catgoryId,
            image:{
              create:{
                fileId: image.fileId,
                name: image.name,
                url: image.url,
                thumbnailUrl: image.thumbnailUrl,
              }
            }
        },
      });

      return sendResponse(res, {
        status: 200,
        data: inventory,
      });
    } catch (error) {
      return sendResponse(res, {
        status: 500,
        error: error.message,
        message: "Failed to create inventory",
      });
    }
  });

// update inventory
export const updateInventory = catchAsyncErrors(async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return sendResponse(res, {
          status: 400,
          error: "Inventory Id is required",
        });
      }

      const { refrence , buyingCost , quantity , description , sellingCost , warehouseLocation , quantityType , alarm , catgoryId } = req.body;
  
      // error handling
      if (!refrence || !buyingCost  || !quantity || !description || !sellingCost || !warehouseLocation || !quantityType || !alarm || !catgoryId) {
        return sendResponse(res, {
          status: 400,
          error: "Please fill the required fields",
        });
      }
  
      const inventory = await prismadb.Inventory.update({
        where: {
          id
        },
        data: {
            refrence ,
            buyingCost , 
            quantity , 
            description , 
            sellingCost , 
            warehouseLocation , 
            quantityType , 
            alarm , 
            catgoryId
        },
      });
  
      return sendResponse(res, {
        status: 200,
        data: inventory,
      });
    } catch (error) {
      return sendResponse(res, {
        status: 500,
        error: error.message,
      });
    }
  });


  // delete inventory
export const deleteInventory = catchAsyncErrors(async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return sendResponse(res, {
          status: 400,
          error: "Inventory Id is required",
        });
      }
  
      const inventory = await prismadb.Inventory.delete({
        where: {
          id,
        },
      });
  
      if (!inventory) {
        return sendResponse(res, {
          status: 404,
          error: "Inventory not found",
        });
      }
  
      return sendResponse(res, {
        status: 200,
        data: inventory,
      });
    } catch (error) {
      return sendResponse(res, {
        status: 500,
        error: error.message,
      });
    }
  });