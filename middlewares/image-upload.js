const multer = require('multer');
// gives us a string unique id
const uuid = require('uuid').v4;

// we configurate where we wanna save the images
const upload = multer({
    storage: multer.diskStorage({
        destination: 'public-data/images',
        // cb = callback; 
        filename: function(req, file, cb){
            cb(null, uuid() + '-' + file.originalname);
        },
    }),
});

// extract a single file by field name froma the incoming request; here we write the form input name
const configureMulterMiddleware = upload.single('imageName');


module.exports = configureMulterMiddleware;




