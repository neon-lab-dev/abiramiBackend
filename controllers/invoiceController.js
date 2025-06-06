import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";

import prismadb from "../db/prismaDb.js";
import generateInvoiceId from "../utils/generateInvoiceId.js";

// get all invoices
export const getAllInvoices = catchAsyncErrors(async (req, res) => {
  try {
    const invoices = await prismadb.BillingDetails.findMany(
        {
            include: {
                productDetails: true
            }
            ,
            orderBy:{
                createdAt: "desc",
            }
        }
    );

    const totalInvoices = await prismadb.BillingDetails.count();

    const paidInvoices = await prismadb.BillingDetails.count({
        where: {
            billingStatus: "PAID",
        },
    });
    const pendingInvoices = await prismadb.BillingDetails.count({
        where: {
            billingStatus: "PENDING",
        },
    });

    const draftInvoices= totalInvoices - (paidInvoices + pendingInvoices);
    return sendResponse(res, {
      status: 200,
      data: invoices,
        paidInvoices: paidInvoices,
        pendingInvoices: pendingInvoices,
        draftInvoices: draftInvoices,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// get single invoice
export const getSingleInvoice = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "invoice Id is required",
      });
    }

    const invoice = await prismadb.BillingDetails.findFirst({
      where: {
        id,
      },
      include: {
        productDetails: {
          orderBy:{
            serialNo: "asc",
          }
        },
        client: true
      },
      orderBy:{
        createdAt: "desc",
      }
    });

    if (!invoice) {
      return sendResponse(res, {
        status: 404,
        error: "invoice not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: invoice,
    });
  } 
);

// create invoice
export const createInvoice = catchAsyncErrors(async (req, res) => {
  try {
    let { clientName ,
       date ,
       state ,
       code ,
       billingStatus ,
       taxType ,
      totalAmount ,
      subTotal ,
      pfAmount,
       roundOff, 
      taxGST, 
      invoiceType , 
      bankName,
      chequeNumber,
      chequeAmount,
      transport,
      placeOfSupply,
      poNO,
      vehicleNo,
      productDetails,
    } = req.body;

    // error handling
    if (!clientName || !date || !state || !code || !billingStatus || !taxType ||!totalAmount ||!taxGST ||!subTotal  ||!roundOff|| !invoiceType || !productDetails) {
      return sendResponse(res, {
        status: 400,
        error: "Please fill the required fields",
      });
    }
    if(!bankName && !chequeNumber && !chequeAmount) {
      bankName = null;
      chequeNumber = null;
      chequeAmount = null;
    }

    if(!transport && !placeOfSupply && !poNO && !vehicleNo) {
      transport = null;
      placeOfSupply = null;
      poNO = null;
      vehicleNo = null;
    }

    const invoiceId= await generateInvoiceId();
    console.log("this is invoiceId",invoiceId);

    const invoice = await prismadb.BillingDetails.create({
      data: {
        invoiceId,
        clientName,
        date,
        state,
        code,
        billingStatus,
        taxType,
        totalAmount,
        subTotal,
        pfAmount,
        roundOff,
        taxGST,
        invoiceType,
        bankName,
        chequeNumber,
        chequeAmount,
        transport,
        placeOfSupply,
        poNO,
        vehicleNo,
        productDetails: {
            create: productDetails
      }
      },
    });

    return sendResponse(res, {
      status: 200,
      data: invoice,
      productDetails: productDetails
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});

// create invoice by clientName
export const createInvoiceByClientName = catchAsyncErrors(async (req, res) => {
      const { clientName } = req.params;

      if(!clientName) {
        return sendResponse(res, {
          status: 400,
          error: "Client Name is required",
        });
      }

      let {  
        date ,
        state ,
        code ,
        billingStatus ,
        taxType ,
       totalAmount ,
       subTotal ,
       pfAmount,
        roundOff, 
       taxGST, 
       invoiceType , 
       bankName,
       chequeNumber,
       chequeAmount,
       transport,
       placeOfSupply,
       poNO,
       vehicleNo,
       productDetails,
     } = req.body;
  
      // error handling
      if ( !date || !state || !code || !billingStatus || !taxType || !invoiceType || !productDetails) {
        return sendResponse(res, {
          status: 400,
          error: "Please fill the required fields",
        });
      }
      if(!bankName && !chequeNumber && !chequeAmount) {
        bankName = null;
        chequeNumber = null;
        chequeAmount = null;
      }
  
      if(!transport && !placeOfSupply && !poNO && !vehicleNo) {
        transport = null;
        placeOfSupply = null;
        poNO = null;
        vehicleNo = null;
      }
  
      const existingInvoice = await prismadb.BillingDetails.findFirst({
        where: {
          AND: [{ clientName: clientName }, { billingStatus } , {invoiceType}],
        },
      });
  
      if (existingInvoice) {
        return sendResponse(res, {
          status: 400,
          error: "Invoice already exists",
        });
      }
  
      const invoice = await prismadb.BillingDetails.create({
        data: {
          clientName: clientName,
          date,
          state,
          code,
          billingStatus,
          taxType,
          totalAmount,
          subTotal,
          pfAmount,
          roundOff,
          taxGST,
          invoiceType,
          bankName,
          chequeNumber,
          chequeAmount,
          transport,
          placeOfSupply,
          poNO,
          vehicleNo,
          productDetails: {
              create: productDetails
        }
        },
      });
  
      return sendResponse(res, {
        status: 200,
        data: invoice,
        productDetails: productDetails
      });
    });


// delete invoice
export const deleteInvoice = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "invoice Id is required",
      });
    }

    const invoice = await prismadb.BillingDetails.delete({
      where: {
        id,
      },
    });

    if (!invoice) {
      return sendResponse(res, {
        status: 404,
        error: "invoice not found",
      });
    }

    return sendResponse(res, {
      status: 200,
      data: invoice,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});


// update invoice
export const updateInvoice = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, {
        status: 400,
        error: "invoice Id is required",
      });
    }

    let { clientName ,
      date ,
      state ,
      code ,
      billingStatus ,
      taxType ,
     totalAmount ,
     subTotal ,
     pfAmount,
      roundOff, 
     taxGST, 
     invoiceType , 
     bankName,
     chequeNumber,
     chequeAmount,
     transport,
     placeOfSupply,
     poNO,
     vehicleNo,
     productDetails
   } = req.body;

   // error handling
   if (!clientName || !date || !state || !code  || !billingStatus || !taxType ||!totalAmount ||!taxGST ||!subTotal  ||!roundOff|| !invoiceType ) {
     return sendResponse(res, {
       status: 400,
       error: "Please fill the required fields",
     });
   }


   if(!bankName && !chequeNumber && !chequeAmount) {
     bankName = null;
     chequeNumber = null;
     chequeAmount = null;
   }

   if(!transport && !placeOfSupply && !poNO && !vehicleNo) {
     transport = null;
     placeOfSupply = null;
     poNO = null;
     vehicleNo = null;
   }

   // Delete existing product details
   await prismadb.ProductDetails.deleteMany({
    where: { billingDetailsId: id }
  });

     // Update invoice details
     const invoice = await prismadb.BillingDetails.update({
      where: { id },
      data: {
        clientName,
        date,
        state,
        code,
        billingStatus,
        taxType,
        totalAmount,
        subTotal,
        pfAmount,
        roundOff,
        taxGST,
        invoiceType,
        bankName,
        chequeNumber,
        chequeAmount,
        transport,
        placeOfSupply,
        poNO,
        vehicleNo,
        productDetails: {
          create: productDetails
        }
      },
      include: {
        productDetails: true
      }
    });


    return sendResponse(res, {
      status: 200,
      data: invoice,
    });
  } catch (error) {
    return sendResponse(res, {
      status: 500,
      error: error.message,
    });
  }
});


// serach invoices
export const searchInvoices = catchAsyncErrors(async (req, res) => {
    try {
      const { query } = req.query;

  
      const whereClause = {
        OR: [
          query && {
            OR: [
              { clientName: { contains: query } },
              {invoiceId: { contains: query } },
            ]
          }
        ].filter(Boolean)
      };
  
      const Invoices = await prismadb.BillingDetails.findMany({
        where: whereClause,
        include: {
          productDetails: true
        }
      });

      if(Invoices.length === 0){
        return sendResponse(res, {
          status: 404,
          error: "No invoice found",
        });
      }

      const totalInvoices = await prismadb.BillingDetails.count({
        where: whereClause
      });

      const paidInvoices = await prismadb.BillingDetails.count({
        where:
            {
                AND: [whereClause, { billingStatus: "PAID" }]
            }
      });
      const pendingInvoices = await prismadb.BillingDetails.count({
          where:
                {
                    AND: [whereClause, { billingStatus: "PENDING" }]
                }
      });
  
      const draftInvoices= totalInvoices - (paidInvoices + pendingInvoices);
  
      return sendResponse(res, {
        status: 200,
        data: Invoices,
        paidInvoices: paidInvoices,
        pendingInvoices: pendingInvoices,
        draftInvoices: draftInvoices
      });
  
    } catch (error) {
      return sendResponse(res, {
        status: 500,
        error: error.message
      });
    }
  });