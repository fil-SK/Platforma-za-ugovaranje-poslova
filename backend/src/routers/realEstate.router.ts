import express from 'express';
import { RealEstateController } from '../controllers/realEstate.controller';

const realEstateRouter = express.Router();


realEstateRouter.route('/realEstateIntoCollection').post(
    (req, res) => new RealEstateController().insertRealEstateToTheCollection(req, res)
);


export default realEstateRouter;