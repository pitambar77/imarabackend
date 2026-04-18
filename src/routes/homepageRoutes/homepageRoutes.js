import express from "express";
import { getHomepage, saveHomepage } from "../../controller/homePageController/homepageController.js";

const router = express.Router();

router.get("/", getHomepage);
router.post("/", saveHomepage);

export default router;