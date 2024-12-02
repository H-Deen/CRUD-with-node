import express from "express";
import {
  getUsers,
  renderRegisterPage,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../../Controllers/UserController.js";

const router = express.Router();

// Route: Get all users
router
  .route("/")
  .get(getUsers)
  .post(createUser);

// Route: Render register page & register a user
router.get("/register", renderRegisterPage)

// Routes: Get, update, and delete a user by ID
router
  .route("/:id")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

export default router;
