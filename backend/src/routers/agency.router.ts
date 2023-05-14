import express from 'express';
import { AgencyController } from '../controllers/agency.controller';

const agencyRouter = express.Router();

agencyRouter.route('/registerAgency').post(
    (req, res) => new AgencyController().registerAgency(req, res)
);


export default agencyRouter;