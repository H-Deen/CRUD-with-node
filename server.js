import express, { json, urlencoded } from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.set('view engine', 'ejs');

let users = [];

// Load data.json once when the server starts
async function loadData() {
    try {
        const fileData = await fs.readFile(path.resolve('data.json'), 'utf-8');
        users = JSON.parse(fileData);
    } catch (err) {
        console.error("Failed to load data.json:", err);
    }
}

loadData();

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/users', (req, res) => {
    res.render('dashboard', { data: users });
});

app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post(async (req, res) => {
        const { fullName, email, username, cellNum } = req.body;
        const newUser = { id: Date.now(), fullName, email, username, cellNum };

        users.push(newUser);

        try {
            await fs.writeFile('data.json', JSON.stringify(users, null, 2));
            console.log('User added successfully');
            res.redirect('/');
        } catch (error) {
            console.error("Error saving data:", error);
            res.status(500).send("Server Error");
        }
    });


app.route('/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const user = users.find(user => user.id === id)
        console.log(user);
        if (user) {
            res.render('profile', {user})
        } else {
            res.status(404).send({message: 'User not found'})
        }
    })
    .put(async (req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        Object.assign(user, req.body);

        try {
            await fs.writeFile('data.json', JSON.stringify(users, null, 2));
            console.log('User updated successfully');
            res.redirect('/users');
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).send("Server Error");
        }
    })
    .delete(async (req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return res.status(404).send({ message: 'User not found' });
        }

        users.splice(userIndex, 1);

        try {
            await fs.writeFile('data.json', JSON.stringify(users, null, 2));
            console.log('User deleted successfully');
            res.redirect('/users');
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Server Error");
        }
    })

app.listen(3000, () => {
    console.log(`Server started at http://localhost:3000`);
});
