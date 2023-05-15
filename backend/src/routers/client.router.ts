import express from 'express';
import { ClientController } from '../controllers/client.controller';


const clientRouter = express.Router();


clientRouter.route('/registerClient').post(
    (req, res) => new ClientController().registerClient(req, res)
);


clientRouter.route('/loginClient').post(
    (req, res) => new ClientController().loginClient(req, res)
);


clientRouter.route('/loginAdmin').post(
    (req, res) => new ClientController().loginAdmin(req, res)
);


export default clientRouter;