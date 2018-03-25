const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

/***
 * set storage engine
 */
const storage = multer.diskStorage({
    destination : './public/uploads/',
    filename: function(req, file, callback){
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 6000000},
    fileFilter: function(req, file, callback){
        checkFileType(file,callback);
    }}).single('myImage');

// function for checking file type
function checkFileType(file, callback){
    //allowed image extention
    const filetypes = /jpeg|jpg|png|gif/;
    //check extention
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime type
    const mimetype = filetypes.test(file.mimetype);

    //check if both extention and mimetype is true
    if(mimetype && extname){
        return callback(null, true);
    }else{
        callback('Error: Images Only!');
    }
}


//init app
const app = express();

//setup ejs
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));

/***
 * set index route index.ejs 
 * giving error at 'index' instead of 'index.ejs' 
 */
app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req,res, (err) => {
        if(err){
            res.render('index', {
                msg:err
            });
        }else{
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error : No File Selected'
                });
            }else{
                /***
                 * do console.log(req.file) to see the 
                 * details of file uploaded
                 */
                console.log(req.file);
                res.render('index', {
                    msg: 'File uploaded!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

//define port number
const port = 3100;

app.listen(port, () => console.log(`Server started on port ${port}`));

