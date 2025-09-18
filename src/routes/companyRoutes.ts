import express from "express";
import { getCompanies } from "../controllers/companyController";

const router = express.Router();

router.get("/", getCompanies);

export default router;
