import multer from "multer";
import path from 'path'
import { __dirname } from "../utils.js";
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder;
        if (req.body.file == 0) {
            folder = 'profiles';
        } else if (req.body.file == 1) {
            folder = 'products';
        } else {
            folder = 'documents';
        }
        cb(null, path.join(__dirname,  'multer', folder));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({storage: storage})