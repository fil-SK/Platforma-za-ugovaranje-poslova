import express from 'express';
import { ClientController } from '../controllers/client.controller';

import multer from 'multer';
//const upload = multer({ dest: 'uploads/' });


const clientRouter = express.Router();


clientRouter.route('/verifyClientUnique').post(
    (req, res) => new ClientController().verifyClientUnique(req, res)
);


clientRouter.route('/registerClient').post(
    multer({
        storage : multer.diskStorage(
            {
                destination : (req, file, cb) => {
                    cb(null, 'uploads/');
                },
                filename : (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
                }
            })
    }).single('image'),
    (req, res) => new ClientController().registerClient(req, res)
);


clientRouter.route('/loginClient').post(
    (req, res) => new ClientController().loginClient(req, res)
);


clientRouter.route('/loginAdmin').post(
    (req, res) => new ClientController().loginAdmin(req, res)
);


clientRouter.route('/changePassword').post(
    (req,res) => new ClientController().changePassword(req, res)
);


export default clientRouter;