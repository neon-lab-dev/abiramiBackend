import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import { uploadImage } from "../utils/uploadImage.js";
import getDataUri from "../utils/getUri.js";

import prismadb from "../db/prismaDb.js";
import {generateRefrence} from "../utils/generateRefrence.js";


// get inventory item details
export const getItemDetails = catchAsyncErrors(async (req, res) => {
  try {

    // Get total quantity across all inventory
    const totalQuantity = await prismadb.inventory.count();

    // Get low stock count
    const allInventory = await prismadb.inventory.findMany();

    const lowStock = allInventory.filter(item => item.quantity !== 0 && item.quantity < item.alarm).length;
    
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
        totalQuantity: totalQuantity,
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

// get inventories
export const getInventories= catchAsyncErrors(async (req, res) => {
    try {
      const inventories = await prismadb.Inventory.findMany(
        {include: {
          image: true
        }}
      );

      return sendResponse(res, {
        status: 200,
        data: inventories,
      });
    } catch (error) {
      return sendResponse(res, {
        status: 500,
        error: error.message,
      });
    }
});

      

// get single inventory
export const getSingleInventory = catchAsyncErrors(async (req, res) => {
      const { id } = req.params;
      if (!id) {
        return sendResponse(res, {
          status: 400,
          error: "Inventory Id is required",
        });
      }
  
      const inventory = await prismadb.Inventory.findUnique({
        where: {
          id,
        },
        include:{
          image:true
        }
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
  })


// create inventory
export const createInventory = catchAsyncErrors(async (req, res) => {
  try {
    const { buyingCost, quantity, description, sellingCost, warehouseLocation, quantityType, alarm, catgoryId } = req.body;

    // Validate required fields
    if (!quantity || !description || !warehouseLocation || !quantityType || !alarm || !catgoryId) {
      return sendResponse(res, {
        status: 400,
        error: "Please fill the required fields",
      });
    }

    const existingInventory = await prismadb.Inventory.findFirst({
      where: {
        AND: [{ quantity: parseInt(quantity) }, { quantityType }],
      },
    });

    if (existingInventory) {
      return sendResponse(res, {
        status: 400,
        error: "Inventory already exists",
      });
    }

    // Generate a unique reference
    const refrence = await generateRefrence();

    let image = null;

    if (req.file) {
      image = await uploadImage(
        getDataUri(req.file).content,
        getDataUri(req.file).fileName,
        "inventory"
      );
      if (!image) {
        return sendResponse({
          res: 500,
          error: "Failed to upload image.",
        });
      }
    }

    // Log the data being passed to Prisma
    console.log("Creating inventory with data:", {
      refrence,
      buyingCost,
      quantity,
      description,
      sellingCost,
      warehouseLocation,
      quantityType,
      alarm,
      catgoryId,
      image,
    });

    const inventoryData = {
      refrence,
      buyingCost: parseInt(buyingCost),
      quantity: parseInt(quantity),
      description,
      sellingCost: parseInt(sellingCost),
      warehouseLocation,
      quantityType,
      alarm: parseInt(alarm),
      catgoryId,
    };

    // Conditionally include the image field
    if (image) {
      inventoryData.image = {
        create: {
          fileId: image.fileId,
          name: image.name,
          url: image.url,
          thumbnailUrl: image.thumbnailUrl,
        },
      };
    }

    const inventory = await prismadb.Inventory.create({
      data: inventoryData,
    });

    return sendResponse(res, {
      status: 200,
      data: inventory,
      image: image,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return sendResponse(res, {
        status: 400,
        error: "Unique constraint failed. Please try again.",
      });
    }
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

      let { refrence , buyingCost , quantity , description , sellingCost , warehouseLocation , quantityType  , alarm , catgoryId , image  } = req.body;
  
      // error handling
      if (  !buyingCost  || !quantity || !description || !sellingCost || !warehouseLocation || !quantityType || !alarm || !catgoryId
      ) {
        return sendResponse(res, {
          status: 400,
          error: "Please fill the required fields",
        });
      }


      quantity = parseInt(quantity); 


      if(req.file){
        image = await uploadImage(
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
      }

  
      const inventory = await prismadb.Inventory.update({
        where: {
          id
        },
        data: {
            refrence ,
            buyingCost: parseInt(buyingCost) , 
            quantity: quantity , 
            description , 
            sellingCost: parseInt(sellingCost) , 
            warehouseLocation , 
            quantityType , 
            alarm:parseInt(alarm) ,
            catgoryId,
            image: {
              update: {
                fileId: image.fileId,
                name: image.name,
                url: image.url,
                thumbnailUrl: image.thumbnailUrl,
            }
        },
      },
      include:{
        image:true,
      }
    });
  
      return sendResponse(res, {
        status: 200,
        data: inventory
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

// search inventory
export const searchInventories = catchAsyncErrors(async (req, res) => {
  try {
    const { query } = req.query;
    const {catgoryId} = req.params;
    console.log("this is catgoryId",catgoryId)

    const whereClause = {
      AND: [
        { catgoryId: catgoryId },
        {
          OR: [
            query && { refrence: { contains: query } }
          ].filter(Boolean)
        }
      ]
    };

    const Inventories = await prismadb.Inventory.findMany({
      where: whereClause,
      include:{
        image:true
      }
    });

    if(Inventories.length === 0){
      return sendResponse(res, {
        status: 404,
        error: "cannot search inventory with this query",
      });
    }


    return sendResponse(res, {
      status: 200,
      data: Inventories
    });

  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message
    });
  }
});


// updateLogs
export const updateLogs = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "Inventory Id is required",
      });
    }

    const { txnType, txnUnits, comments } = req.body;

    const uniqueInventory= await prismadb.Inventory.findUnique({
      where:{
        id
      }
    })
    console.log("this is uniqueInventory",uniqueInventory.quantity)

    let quantity=parseInt(uniqueInventory.quantity);
    console.log("this is quantity",quantity)

    if(txnType=="SELL"){
      quantity=quantity-txnUnits;
    }else{
      quantity=quantity+txnUnits;
    }

    const inventory = await prismadb.Inventory.update({
      where: {
        id,
      },
      data: {
        quantity: quantity,
        transactions: {
          create: {
            txnType,
            txnUnits,
            comments,
          },
        },
      },
      include:{
        transactions:true,
      }
    });

    return sendResponse(res, {
      status: 200,
      data: inventory,
    });
});

// getInventoryLogs
export const getInventoryLogs = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "Inventory Id is required",
      });
    }

    const inventorywithLogs= await prismadb.Inventory.findUnique({
      where:{
        id,
      },
      include:{
        transactions:{
          orderBy:{
            createdAt:"desc"
          }
        }
      }
    })

    if (!inventorywithLogs) {
      return sendResponse(res, {
        status: 404,
        error: "Inventory logs not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: inventorywithLogs.transactions,
    });
  } 
);