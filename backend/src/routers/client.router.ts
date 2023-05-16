import express from 'express';
import { ClientController } from '../controllers/client.controller';

import multer from 'multer';
//const upload = multer({ dest: 'uploads/' });


const clientRouter = express.Router();

// Problem koji postoji jeste sto si ovde, na liniji 5, pravio novi multer, a nisi korisio onaj koji je napravljen u server.ts fajlu
// Samim tim, onaj multer iz server.ts fajla ce da obradi elemente forme, ali multer iz ovog fajla za njih ne zna, pa ti se zato ne salju u post zahtev
// Znaci samo moras da skontas kako da multer iz server.ts iskoristis u client.router.ts

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

/*
clientRouter.route('/registerClient').post(
    upload.single('image'),
    (req, res) => new ClientController().registerClient(req, res)
);
*/

clientRouter.route('/loginClient').post(
    (req, res) => new ClientController().loginClient(req, res)
);


clientRouter.route('/loginAdmin').post(
    (req, res) => new ClientController().loginAdmin(req, res)
);


export default clientRouter;