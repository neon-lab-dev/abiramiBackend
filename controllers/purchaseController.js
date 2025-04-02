import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";

import prismadb from "../db/prismaDb.js";


// get all purchases
export const getALLPurchases= catchAsyncErrors(async (req, res)=>{
    const purchases = await prismadb.Purchase.findMany();

    if(!purchases){
        return sendResponse(res, {
            status: 404,
            error: "Purchases not found",
        });
    }

    const totalPurchases= await prismadb.Purchase.count();

    const activePurchases= await prismadb.Purchase.count({
        where:{
            status: "active",
        },
    }); 

    const inactiveClinets= totalPurchases-activePurchases;

    return sendResponse(res, {
        status: 200,
        data: purchases,
        totalPurchases,
        activePurchases,
        inactiveClinets,
    });
})

// get single purchase
export const getSinglePurchase= catchAsyncErrors(async (req, res)=>{
    const {id}= req.params;

    if(!id){
        return sendResponse(res, {
            status: 400,
            error: "Purchase Id is required",
        });
    }

    const purchase = await prismadb.Purchase.findUnique({
        where: {
            id,
        },
    });

    if(!purchase){
        return sendResponse(res, {
            status: 404,
            error: "Purchase not found",
        });
    }

    return sendResponse(res, {
        status: 200,
        data: purchase,
    });
})

// create purchase
export const createPurchase= catchAsyncErrors(async (req, res)=>{
    const {companyName , invoiceNumber , date ,totalPurchaseAmt , gstNum , status}= req.body;

    if(!companyName || !invoiceNumber || !date || !totalPurchaseAmt || !status){
        return sendResponse(res, {
            status: 400,
            error: "Please fill all the fields",
        });
    }

    const existingPurchase = await prismadb.Purchase.findFirst({
        where: {
          AND: [ { invoiceNumber } , {totalPurchaseAmt}],
        },
    });
      
      if (existingPurchase) {
        return sendResponse(res, {
          status: 400,
          error: "Purchase already exists",
        });
      }

    const purchase = await prismadb.Purchase.create({
        data: {
            companyName,
            invoiceNumber,
            date,
            totalPurchaseAmt,
            gstNum,
            status,
        },
    });

    return sendResponse(res, {
        status: 201,
        data: purchase,
    });
})

// update purchase
export const updatePurchase= catchAsyncErrors(async (req, res)=>{
    const {id}= req.params;

    if(!id){
        return sendResponse(res, {
            status: 400,
            error: "Purchase Id is required",
        });
    }

    const {companyName , invoiceNumber , date ,totalPurchaseAmt , gstNum , status}= req.body;

    const purchase = await prismadb.Purchase.update({
        where: {
            id,
        },
        data: {
            companyName,
            invoiceNumber,
            date,
            totalPurchaseAmt,
            gstNum,
            status,
        },
    });

    return sendResponse(res, {
        status: 200,
        data: purchase,
    });
})

// delete purchase
export const deletePurchase= catchAsyncErrors(async (req, res)=>{
    const {id}= req.params;

    if(!id){
        return sendResponse(res, {
            status: 400,
            error: "Purchase Id is required",
        });
    }

    const purchase = await prismadb.Purchase.delete({
        where: {
            id,
        },
    });

    if(!purchase){
        return sendResponse(res, {
            status: 404,
            error: "Purchase not found",
        });
    }

    return sendResponse(res, {
        status: 200,
        data: purchase,
    });
})


// search purchases
export const searchPurchases = catchAsyncErrors(async (req, res) => {
    try {
      const { query } = req.query;

      const whereClause = {
        OR: [
          query && {
            OR: [
              { companyName: { contains: query } },
            ]
          }
        ].filter(Boolean)
      };
  
      const Purchases = await prismadb.Purchase.findMany({
        where: whereClause,
      });

      if(Purchases.length === 0){
        return sendResponse(res, {
          status: 404,
          error: "No invoice found",
        });
      }

      const totalPurchases= await prismadb.Purchase.count(
        {where: whereClause}
      );

      const activePurchases= await prismadb.Purchase.count({
        where:{
            AND: [whereClause, { status: "ACTIVE" }]
        }
      }); 
  
      const inactiveClinets= totalPurchases-activePurchases;
  
  
      return sendResponse(res, {
        status: 200,
        data: Purchases,
        totalPurchases: totalPurchases,
        activePurchases: activePurchases,
        inactiveClinets: inactiveClinets,
      });
  
    } catch (error) {
      return sendResponse(res, {
        status: 500,
        error: error.message
      });
    }
  });
