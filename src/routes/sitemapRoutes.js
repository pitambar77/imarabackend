import express from "express";
import { generateSitemap } from "../controller/sitemapController.js";

const router = express.Router();

router.get("/sitemap.xml", generateSitemap);

export default router;
