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
    limits: {fileSize}
}).single('myImage');


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
            console.log(req.file);
            res.send('test');
        }
    });
});

//define port number
const port = 3100;

app.listen(port, () => console.log(`Server started on port ${port}`));

