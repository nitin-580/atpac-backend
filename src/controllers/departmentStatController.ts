import { Request, Response } from "express";
import DepartmentStat from "../models/DepartmentStatModel"; // Ensure correct path

// @desc    Get all department statistics
// @route   GET /api/stats
// @access  Public
export const getDepartmentStats = async (req: Request, res: Response) => {
    try {
        const query = req.query.batchYear ? { batchYear: req.query.batchYear } : {};
        const data = await DepartmentStat.find(query).sort({
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

        const unplaced = eligibleStudents - placementsPlaced;

        const newStat = new DepartmentStat({
            departmentName,
            degree,
            batchYear,
            totalStudents,
            eligibleStudents,
            placementsPlaced,
            internshipsPlaced,
            unplaced
        });

        const savedStat = await newStat.save();
        res.status(201).json(savedStat);
    } catch (error) {
        console.error("❌ Error creating Department Stat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get a single department statistic by name
// @route   GET /api/stats/:departmentName
// @access  Public
export const getDepartmentStatByNameandDegree = async (req: Request, res: Response) => {
    try {
        const stat = await DepartmentStat.findOne({
            departmentName: req.params.departmentName,
            degree: req.params.degree
        });

        if (!stat) {
            return res.status(404).json({ message: "Statistic not found" });
        }

        res.status(200).json(stat);
    } catch (error) {
        console.error("❌ Error fetching single Department Stat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update a department statistic by name
// @route   PUT /api/stats/:departmentName
// @access  Private
export const updateDepartmentStatByNameandDegree = async (
    req: Request,
    res: Response
) => {
    try {
        const updatedStat = await DepartmentStat.findOneAndUpdate(
            { departmentName: req.params.departmentName,degree:req.params.degree },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStat) {
            return res.status(404).json({ message: "Statistic not found" });
        }

        res.status(200).json(updatedStat);
    } catch (error) {
        console.error("❌ Error updating Department Stat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Delete a department statistic by name
// @route   DELETE /api/stats/:departmentName
// @access  Private
export const deleteDepartmentStatByNameandDegree = async (
    req: Request,
    res: Response
) => {
    try {
        const stat = await DepartmentStat.findOneAndDelete({
            departmentName: req.params.departmentName,
        });

        if (!stat) {
            return res.status(404).json({ message: "Statistic not found" });
        }

        res.status(200).json({ message: "Statistic deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting Department Stat:", error);
        res.status(500).json({ message: "Server error" });
    }
};