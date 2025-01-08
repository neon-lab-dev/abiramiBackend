import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";

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
        if (!refrence || !buyingCost || !quantity || !description || !sellingCost || !warehouseLocation || !quantityType || !alarm || !catgoryId) {
        return sendResponse(res, {  
            status: 400,
            error: "Please fill the required fields",
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

