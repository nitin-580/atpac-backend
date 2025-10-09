import { Request, Response } from "express";
import DepartmentStat from "../models/DepartmentStatModel"; // Ensure correct path

// @desc    Get all department statistics with dynamic filtering
// @route   GET /api/stats
// @access  Public
export const getDepartmentStats = async (req: Request, res: Response) => {
    try {
        const query: any = {};

        // Dynamically build the query object from the request's query parameters
        if (req.query.departmentName) {
            query.departmentName = req.query.departmentName;
        }
        if (req.query.degree) {
            query.degree = req.query.degree;
        }
        if (req.query.batchYear) {
            query.batchYear = req.query.batchYear;
        }

        const data = await DepartmentStat.find(query).sort({
            batchYear: -1,
            degree: 1,
            departmentName: 1,
        });

        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching Department Stats:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Create a new department statistic
// @route   POST /api/stats
// @access  Private
export const createDepartmentStat = async (req: Request, res: Response) => {
    try {
        const {
            departmentName,
            degree,
            batchYear,
            totalStudents,
            eligibleStudents,
            placementsPlaced,
            internshipsPlaced,
        } = req.body;

        if (!departmentName || !degree || !batchYear) {
            return res
                .status(400)
                .json({ message: "Please provide all required fields" });
        }

        // Correctly calculate unplaced students
        const unplaced = eligibleStudents - (placementsPlaced + internshipsPlaced);

        const newStat = new DepartmentStat({
            departmentName,
            degree,
            batchYear,
            totalStudents,
            eligibleStudents,
            placementsPlaced,
            internshipsPlaced,
            unplaced,
        });

        const savedStat = await newStat.save();
        res.status(201).json(savedStat);
    } catch (error) {
        console.error("❌ Error creating Department Stat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get a single stat by its unique identifiers
// @route   GET /api/stats/:departmentName/:degree/:batchYear
// @access  Public
export const getDepartmentStat = async (req: Request, res: Response) => {
    try {
        const { departmentName, degree, batchYear } = req.params;

        // Use all three fields to find the unique document
        const stat = await DepartmentStat.findOne({ departmentName, degree, batchYear });

        if (!stat) {
            return res.status(404).json({ message: "Statistic not found" });
        }

        res.status(200).json(stat);
    } catch (error) {
        console.error("❌ Error fetching single Department Stat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update a stat by its unique identifiers
// @route   PUT /api/stats/:departmentName/:degree/:batchYear
// @access  Private
export const updateDepartmentStat = async (req: Request, res: Response) => {
    try {
        const { departmentName, degree, batchYear } = req.params;

        const stat = await DepartmentStat.findOne({ departmentName, degree, batchYear });

        if (!stat) {
            return res.status(404).json({ message: "Statistic not found" });
        }

        // Update fields from request body, keeping existing values if not provided
        stat.totalStudents = req.body.totalStudents ?? stat.totalStudents;
        stat.eligibleStudents = req.body.eligibleStudents ?? stat.eligibleStudents;
        stat.placementsPlaced = req.body.placementsPlaced ?? stat.placementsPlaced;
        stat.internshipsPlaced = req.body.internshipsPlaced ?? stat.internshipsPlaced;

        // Recalculate the 'unplaced' field to ensure data integrity
        stat.unplaced = stat.eligibleStudents - (stat.placementsPlaced + stat.internshipsPlaced);

        const updatedStat = await stat.save();
        res.status(200).json(updatedStat);
    } catch (error) {
        console.error("❌ Error updating Department Stat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Delete a stat by its unique identifiers
// @route   DELETE /api/stats/:departmentName/:degree/:batchYear
// @access  Private
export const deleteDepartmentStat = async (req: Request, res: Response) => {
    try {
        const { departmentName, degree, batchYear } = req.params;

        // Use all three fields to find and delete the unique document
        const stat = await DepartmentStat.findOneAndDelete({ departmentName, degree, batchYear });

        if (!stat) {
            return res.status(404).json({ message: "Statistic not found" });
        }

        res.status(200).json({ message: "Statistic deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting Department Stat:", error);
        res.status(500).json({ message: "Server error" });
    }
};