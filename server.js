import express, { json, urlencoded } from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.set("view engine", "ejs");

let users = [];

async function loadUsers() {
  try {
    const fileData = await fs.readFile(path.resolve("data.json"), "utf-8");
    users = JSON.parse(fileData);
  } catch (err) {
    console.error("Failed to load data.json:", err);
  }
}

loadUsers();

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/users", (req, res) => {
  res.render("dashboard", { data: users });
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
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
  });

app
  .route("/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    console.log(user);
    if (user) {
      res.render("profile", { user });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
  .put(async (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    Object.assign(user, req.body);

    try {
      await fs.writeFile("data.json", JSON.stringify(users, null, 2));
      console.log("User updated successfully");
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Server Error");
    }
  })
  .delete(async (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    console.log(userIndex);
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
  });





// These are /products endpoints

let products = [];

async function loadProducts() {
  try {
    const fileData = await fs.readFile(path.resolve("products.json"), "utf-8");
    products = JSON.parse(fileData);
  } catch (err) {
    console.error("Failed to load products.json:", err);
  }
}

loadProducts();

app.get("/products", (req, res) => {
    res.render("store", { data: products });
  })

app.route('/createProduct')
.get((req, res)=>{
    res.render('addProduct')
})
.post(async (req, res) => {

    const { productName, price, quantity} = req.body;
    const newProduct = { id: Date.now(), productName, price, quantity };

    products.push(newProduct);

    try {
      await fs.writeFile("products.json", JSON.stringify(products, null, 2));
      console.log("Product added successfully");
      res.redirect("/products");
    } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).send("Server Error");
    }
  });

app
  .route("/products/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id === id);
    console.log(product);
    if (product) {
      res.render("product", { product });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
  .put(async (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id === id);
    Object.assign(product, req.body);

    try {
      await fs.writeFile("products.json", JSON.stringify(products, null, 2));
      console.log("Product updated successfully");
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Server Error");
    }
  })
  .delete(async (req, res) => {
    const id = Number(req.params.id);
    const productIndex = products.findIndex((product) => product.id === id);
    console.log(productIndex);
    if (productIndex === -1) {
      return res.status(404).send({ message: "Product not found" });
    }

    users.splice(productIndex, 1);

    try {
      await fs.writeFile("products.json", JSON.stringify(products, null, 2));
      console.log("Product deleted successfully");
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Server Error");
    }
  });


  // These are /api/products endpoints

app.route("/api/products")
.get((req, res) => {
    res.json({data: products})
})
.post(async (req, res) => {

    const { productName, price, quantity} = req.body;
    const newProduct = { id: Date.now(), productName, price, quantity };

    products.push(newProduct);

    try {
      await fs.writeFile("products.json", JSON.stringify(products, null, 2));
      console.log("Product added successfully");
      res.status(201).send({message: "Product added successfully"})
    } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).send("Server Error");
    }
  })

app
  .route("/api/products/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id === id);
    console.log(product);
    if (product) {
      res.render("product", { product });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
  .put(async (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((product) => product.id === id);
    Object.assign(product, req.body);

    try {
      await fs.writeFile("products.json", JSON.stringify(products, null, 2));
      console.log("Product updated successfully");
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Server Error");
    }
  })
  .delete(async (req, res) => {
    const id = Number(req.params.id);
    const productIndex = products.findIndex((product) => product.id === id);
    console.log(productIndex);
    if (productIndex === -1) {
      return res.status(404).send({ message: "Product not found" });
    }

    users.splice(productIndex, 1);

    try {
      await fs.writeFile("products.json", JSON.stringify(products, null, 2));
      console.log("Product deleted successfully");
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Server Error");
    }
  });

app.listen(3000, () => {
  console.log(`Server started at http://localhost:3000`);
});
