const multer = require('multer');
const {v4: uuidv4 } = require('uuid');
console.log(uuidv4())

const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
}

let storage = multer.diskStorage({
    destination:(req, file , cb)=>{
        cb (null,__dirname+'/../public/img-uploads')
    },
    filename :(req,file,cb)=>{
        let ext = extMap[file.mimetype]
        cb(null , uuidv4()+ext)
    }
});
let fileFilter = (req, file , cb )=>{
    cb(null, !!extMap[file.mimetype]);
};
const upload = multer({storage,fileFilter});
module.exports = upload;