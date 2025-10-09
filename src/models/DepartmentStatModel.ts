import mongoose, { Schema, Document } from "mongoose";

// The updated interface reflecting both placement and internship stats
export interface IDepartmentStats extends Document {
  departmentName: string;
  degree: string;
  batchYear: number;
  totalStudents: number;
  eligibleStudents: number;

  // Placement-specific fields
  placementsPlaced: number;
  unplacedForPlacements: number;
  placementRate: number;

  // Internship-specific fields
  internshipsPlaced: number;
  internshipRate: number;
}

// The updated Mongoose Schema
const DepartmentStatsSchema: Schema = new Schema(
  {
    departmentName: { type: String, required: true },
    degree: { type: String, required: true },
    batchYear: { type: Number, required: true, index: true },

    // Overall student counts
    totalStudents: { type: Number, required: true, default: 0 },
    eligibleStudents: { type: Number, required: true, default: 0 },

    // --- Placement Statistics ---
    placementsPlaced: { type: Number, required: true, default: 0 },

    // --- Internship Statistics ---
    internshipsPlaced: { type: Number, required: true, default: 0 },

    // Calculated fields eligible-placement-internship
    unplaced: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Compound index for efficient querying remains the same
DepartmentStatsSchema.index(
  { departmentName: 1, degree: 1, batchYear: 1 },
  { unique: true }
);

export default mongoose.model<IDepartmentStats>("DepartmentStat", DepartmentStatsSchema);