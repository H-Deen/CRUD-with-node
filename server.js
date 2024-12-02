import express, { json, urlencoded } from "express";
import userRoutes from './Routes/Web/UserRoutes.js';
import userApiRoutes from './Routes/Api/UserApiRoutes.js';


const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.set("view engine", "ejs");


app.get('/', (req, res) => {
  res.render('home'); 
});

// Web routes
app.use('/users', userRoutes); 

// API routes
app.use('/api/users', userApiRoutes);    
 


app.listen(3000, () => {
  console.log(`Server started at http://localhost:3000`);
});
