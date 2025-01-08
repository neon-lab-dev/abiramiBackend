import catchAsyncError from "../middlewares/catch-async-error.js"
import { sendResponse } from "../middlewares/sendResponse.js";
import getDataUri from "../utils/getUri.js";
import { uploadImage, deleteImage } from "../utils/upload.js";

import prismadb from "../db/prismaDb.js";

export const imageUpload = catchAsyncError(async (req, res) => {

    if (!req.file) {
        return sendResponse({
            res: 400,
            error: "Please upload an image file."
        });
    }

  const image = await uploadImage(
    getDataUri(req.file).content,
    getDataUri(req.file).fileName,
    "mind-forge"
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
  return sendResponse({
    res: 200,
    data: newImage
  });
});

export const imageDelete = catchAsyncError(async (req, res) => {

  const { fileId } = req.params;
  const deleted = await deleteImage(fileId);
  const image = await prismadb.Image.findOneAnddelete({ fileId });
  if (!deleted) {
    return sendResponse({
      res: 500,
      error: "Failed to delete image."
    });
  }
    return sendResponse({
        res: 200,
        data: image,
        message: "Image deleted successfully."
    });
});