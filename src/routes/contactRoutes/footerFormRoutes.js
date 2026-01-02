import express from "express";
import { submitFooterForm } from "../../controller/contactController/footerFormController.js";

const router = express.Router();

router.post("/", submitFooterForm);

export default router;
