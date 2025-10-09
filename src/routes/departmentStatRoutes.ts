import express from "express";
import {
    getDepartmentStats,
    createDepartmentStat,
    getDepartmentStatByNameandDegree,
    updateDepartmentStatByNameandDegree,
    deleteDepartmentStatByNameandDegree,
} from "../controllers/departmentStatController"; // Ensure correct path

const router = express.Router();

// Routes for the base path: fetching all stats or creating a new one
router.route("/")
    .get(getDepartmentStats)
    .post(createDepartmentStat);

// Routes for a specific stat, identified by its name in the URL
router.route("/:departmentName/:degree")
    .get(getDepartmentStatByNameandDegree)
    .put(updateDepartmentStatByNameandDegree)
    .delete(deleteDepartmentStatByNameandDegree);

export default router;