// routes/blogRoutes.ts
import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogsController";

const router = Router();

// Create a new blog
router.post("/", createBlog);

// Get all blogs
router.get("/", getAllBlogs);

// Get a single blog by ID
router.get("/:id", getBlogById);

// Update a blog by ID
router.patch("/:id", updateBlog);

// Delete a blog by ID
router.delete("/:id", deleteBlog);

export default router;
