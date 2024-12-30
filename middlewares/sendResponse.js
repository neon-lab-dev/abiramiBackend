import ENV_CONFIG from "../config/config.js";
import { STATUS } from "../constants/status.constants.js";

export const sendResponse = (res, responseData) => {
    let error = undefined;

    if (responseData.error) {
        if (ENV_CONFIG.NODE_ENV === "development" || responseData.forceError) {
            error = responseData.error;
        } else {
            error =
                "The actual error has been hidden for security reasons, Please report the administrator for more information.";
        }
    }

    return res.status(responseData.status).json({
        ...STATUS[responseData.status || 200],
        ...responseData,
        error,
    });
};