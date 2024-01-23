const express = require('express');
const bcrypt = require('bcryptjs');
const ejs = require('ejs');
const app = express();
const path = require('path');
const collection = require("./src/config");

app.set('view engine', 'ejs');
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine

app.get('/', (req, res) =>{
    res.render("home")
});

app.get('/login', (req, res) =>{
    res.render("login")
});

app.get("/pay", (req, res) =>{
    res.render("pay");
});

app.get("/checkout", (req, res) => {
    res.render("flutter")
});

app.get("/course", (req, res) => {
    res.render("course")
});
//Register functionality

app.post("/pay", async(req,res) =>{
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
    }


    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.render("flutter", {payerMail: data.email});
      
    }
    
});

app.get('/checkout', async (req, res) => {

    const status = {
        Success: 'Yes',
        Failed: 'No'
    };

    if (req.query.status === 'successful') {
        const transactionDetails = await Transaction.find({ref: req.query.tx_ref});
        const response = await flw.Transaction.verify({id: req.query.transaction_id});
        if (
            response.data.status === "successful"
            && response.data.amount === transactionDetails.amount
            && response.data.currency === "NGN") {
            
            await collection.insert(status.Success)

            res.render("course")
        } else {
            // Inform the customer their payment was unsuccessful
            await collection.insert(status.Failed)
            res.render("pay")
        }
    }
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        //Check if User has paid
        /*const hasPaid = await collection.findOne({ pay: Good });
        if(!hasPaid) {
            res.render("pay")
        }
        else {
            res.render("course");
        }*/
    }
    catch {
        res.send("wrong Details");
    }
});



// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
