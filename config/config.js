import createEnv from "../utils/createEnv.js";
import { config } from "dotenv";

config();

const ENV_CONFIG = createEnv({
    DATABASE_URI: {
        value: process.env.DATABASE_URI,
        required: true,
    },
    PORT: {
        value: process.env.PORT || "5000",
        required: false,
        type: "number",
    },
    FRONTEND_URL: {
        value: process.env.FRONTEND_URL,
        required: true,
        type: "array",
        isUrl: true,
    },
    NODE_ENV: {
        value: process.env.NODE_ENV || "development",
        required: false,
    },
    MAX_REQUEST_SIZE: {
        value: process.env.MAX_REQUEST_SIZE || "10mb",
        required: false,
    },
});

export default ENV_CONFIG;