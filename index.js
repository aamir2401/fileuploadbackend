// have to create app
const express = require('express')
const app = express();
//find port
require('dotenv').config()
const PORT = process.env.PORT || 4000 

// find middleware
app.use(express.json());



const fileupload = require('express-fileupload');
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));
// app.post('/upload', function(req, res) {
//     console.log(req.files.foo); // the uploaded file object
//   });

// have to connect with databse
const db = require('./config/database');
db.connect();

// make connection with cloudinary
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// mount api routes
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);

//activate server
app.listen(PORT, () =>
{
    console.log(`App is listning to ${PORT}`)
})
