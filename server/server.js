const express = require('express'); // installing necessary dependencies
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express(); // creating an instance of express
app.use(cors()); //addressing sequirity issues by allowing cross-origin requests
app.use(express.json()); //parsing incoming requests with JSON payloads (it is middleware function that is built into Express)
app.use(express.static(path.join(__dirname, 'public'))); //middleware function to serve static files from the public directory
const port = 5000; //application's port

// to complete the setup we need to create a connection to the database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "students"
})
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});

app.post('/add_user', (req, res) => { // defining a route to handle POST requests to the /add_user endpoint
    sql = "INSERT INTO student_details (`name`, `email`, `age`, `gender`) VALUES (?, ?, ?, ?)"; // SQL query to insert a new user into the student_details table
    const values = [
        req.body.name, 
        req.body.email, 
        req.body.age, 
        req.body.gender
    ]
    db.query(sql, values, (err, results) => { // executing the SQL query with the provided values and handling the response
        if (err) return res.status(500).json({message: "Error inserting user into database", error: err});
        return res.status(200).json({message: "User added successfully", results: results});
    })
});
app.get('/students', (req, res) => { // defining a route to handle GET requests to the /students endpoint
    const sql = "SELECT * FROM student_details";

    db.query(sql, (err, results) => { // executing the SQL query to fetch all students from the student_details table
        if (err) return res.status(500).json({message: "Error fetching students from database", error: err});
        return res.status(200).json(results);
    });
});

app.get("/get_student/:id", (req, res) => { // defining a route to handle GET requests to the /get_student/:id endpoint
    const id = req.params.id;
    const sql = 'SELECT * FROM student_details WHERE `id` = ?'; // SQL query to fetch a specific student by id from the student_details table
    db.query(sql, [id], (err, results) => { // executing the SQL query with the provided id and handling the response
        if (err) return res.status(500).json({message: 'Error fetching student from database', error: err});
        // if (results.length ===0) return res.status(404).json({message: 'Student not found'})
        return res.status(200).json({message: 'Student fetched successfully', student: results[0]});
    });
    
})

// finally we are making the application to ready to listen to incoming requests on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});