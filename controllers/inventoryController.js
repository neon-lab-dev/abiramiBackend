import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import { uploadImage } from "../utils/uploadImage.js";
import getDataUri from "../utils/getUri.js";

import prismadb from "../db/prismaDb.js";


// get inventory item details
export const getItemDetails= catchAsyncErrors(async (req , res)=>{
    try{
        const totalItem= await prismadb.Inventory.aggregate({
            _sum:{
                quantity:true
            }
        })
        const lowStock = await prismadb.Inventory.count({
            where:{
                quantity:{
                    _lt:100
                }
            }
        })
        const outOfStock = await prismadb.Inventory.count({
            where:{
                quantity:{
                    _eq:0
                }
            }
        })

        return sendResponse({
            res:200,
            data:{
                totalItem:totalItem._sum.quantity,
                lowStock: lowStock,
                outOfStock: outOfStock
            }
        })
    }catch(error){
        return sendResponse({
            res:500,
            error:error.message
        })
    }
})

// create inventory
export const createInventory = catchAsyncErrors(async (req, res) => {
    try {
      const { refrence , buyingCost , quantity , description , sellingCost , warehouseLocation , quantityType , alarm , catgoryId } = req.body;
      // error handling
        if(!refrence||!buyingCost)
        {
            return sendResponse({
                res:400,
                error:"Please fill the required field refrence and buyingCost"
            })
        }

        if(!quantity || !description ){
            return sendResponse({
                res:400,
                error:"Please fill the required fields quantity and description"
            })  
        }

        if(!sellingCost || !warehouseLocation){
            return sendResponse({
                res:400,
                error:"Please fill the required fields sellingCost and warehouseLocation"
            })  
        } 

        if(!quantityType || !alarm){
            return sendResponse({
                res:400,
                error:"Please fill the required fields quantityType and alarm"
            })
        }

        if(!catgoryId){
            return sendResponse({
                res:400,
                error:"Please fill the required field catgoryId"
            })
        }

        if (!req.file) {
          return sendResponse({
              res: 400,
              error: "Please upload an image file."
          });
        }

        const existingInventory = await prismadb.Inventory.findFirst({
          where: {
            AND: [{ refrence }, { quantity } , {quantityType}],
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
      );
      if (!image) {
        return sendResponse({
          res: 500,
          error: "Failed to upload image."
        });
      }
      const newImage = await prismadb.Image.create({
        fileId: image.fileId,
        name: image.name,
        url: image.url,
        thumbnailUrl: image.thumbnailUrl,
      })
  
  
  
      const inventory = await prismadb.Inventory.create({
        data: {
            refrence ,
            buyingCost , 
            quantity , 
            description , 
            sellingCost , 
            warehouseLocation , 
            quantityType , 
            alarm , 
            catgoryId,
            image:{
              create: newImage
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