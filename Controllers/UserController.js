import fs from "fs/promises";
import path from "path";

let users = [];

// Load users from data.json
async function loadUsers() {
  try {
    const fileData = await fs.readFile(path.resolve("data.json"), "utf-8");
    users = JSON.parse(fileData);
  } catch (err) {
    console.error("Failed to load data.json:", err);
  }
}

// Controller: Get all users
export const getUsers = (req, res) => {
  res.render("dashboard", { data: users });
};

// Controller: Render registration page
export const renderRegisterPage = (req, res) => {
  res.render("register");
};

// Controller: Register a new user
export const createUser = async (req, res) => {
  const { fullName, email, username, cellNum } = req.body;
  const newUser = { id: Date.now(), fullName, email, username, cellNum };

  users.push(newUser);

  try {
    await fs.writeFile("data.json", JSON.stringify(users, null, 2));
    console.log("User added successfully");
    res.redirect("/users");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Server Error");
  }
};

// Controller: Get a user by ID
export const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (user) {
    res.render("profile", { user });
  } else {
    res.status(404).send({ message: "User not found" });
  }
};

// Controller: Update a user by ID
export const updateUserById = async (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  Object.assign(user, req.body);

  try {
    await fs.writeFile("data.json", JSON.stringify(users, null, 2));
    console.log("User updated successfully");
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Server Error");
  }
};

// Controller: Delete a user by ID
export const deleteUserById = async (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).send({ message: "User not found" });
  }

  users.splice(userIndex, 1);

  try {
    await fs.writeFile("data.json", JSON.stringify(users, null, 2));
    console.log("User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Server Error");
  }
};

// Load users when the module is loaded
loadUsers();
