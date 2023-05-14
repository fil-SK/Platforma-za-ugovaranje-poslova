import express from 'express';
import { ClientController } from '../controllers/client.controller';


const clientRouter = express.Router();


clientRouter.route('/registerClient').post(
    (req, res) => new ClientController().registerClient(req, res)
);


export default clientRouter;