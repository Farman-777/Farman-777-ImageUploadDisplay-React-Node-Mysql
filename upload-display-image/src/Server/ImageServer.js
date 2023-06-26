const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const multer = require("multer")
const path = require("path")

const Port = 5001;
const app = express();

//use express static folder
app.use(cors());
app.use(express.static("./public"));
app.use(express.json());

// Database connection
const conn = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "", 
  database: "ImageUD",
});

conn.connect((error) => {
  if (error) throw error;
  console.log("Connection Established Successfully");
});

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, path.join(__dirname, "public", "images")); // Corrected destination path
        // callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});
  

//route for post data
app.post("/uploadImage", upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://127.0.0.1:5001/images/' + req.file.filename
        var insertData = "INSERT INTO imagetable(path)VALUES(?)"
        conn.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
        })
    }
});



app.get("/getImages", (req, res) => {
    const query = "SELECT * FROM imagetable"; // Replace with your actual table name
    conn.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to retrieve images" });
      } else {
        res.status(200).json(result);
      }
    });
  });
  

  
 
app.listen(Port, () => console.log(`server started at Port : ${Port}`));
