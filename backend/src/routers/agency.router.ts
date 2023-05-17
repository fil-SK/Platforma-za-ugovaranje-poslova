import express from 'express';
import { AgencyController } from '../controllers/agency.controller';


import multer from 'multer';


const agencyRouter = express.Router();


agencyRouter.route('/registerAgency').post(
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
    (req, res) => new AgencyController().registerAgency(req, res)
);


agencyRouter.route('/loginAgency').post(
    (req, res) => new AgencyController().loginAgency(req, res)
);


export default agencyRouter;