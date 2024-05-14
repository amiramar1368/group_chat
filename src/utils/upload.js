import multer from "multer";

const fileFilter = function (req, file, cb) {
    // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    //   cb(null, true);
    // } else {
    //   cb(new Error('Only JPEG and PNG files are allowed!'), false);
    // }
  };
export const upload = multer();


  
  