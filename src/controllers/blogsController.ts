import { Request, Response } from "express";
import Blog from "../models/blogsModel";

// 📌 Get all blogs (with optional filters: author, tags, published only)
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { author, tag, published } = req.query;
    const filter: any = {};

    if (author) filter.author = author;
    if (tag) filter.tags = { $in: [tag] };
    if (published) filter.isPublished = published === "true";

    const blogs = await Blog.find(filter)
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 📌 Get single blog by ID
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 📌 Create new blog
export const createBlog = async (req: Request, res: Response) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: "Error creating blog", error: err });
  }
};

// 📌 Update blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: "Error updating blog", error: err });
  }
};

// 📌 Delete blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 📌 Like a blog
export const likeBlog = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: userId } }, // prevents duplicates
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error liking blog", error: err });
  }
};

// 📌 Unlike a blog
export const unlikeBlog = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error unliking blog", error: err });
  }
};

// 📌 Add comment
export const addComment = async (req: Request, res: Response) => {
  try {
    const { userId, text } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: { user: userId, text, createdAt: new Date() } },
      },
      { new: true }
    ).populate("comments.user", "name email");

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err });
  }
};
