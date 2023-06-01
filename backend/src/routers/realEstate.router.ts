import express from 'express';
import { RealEstateController } from '../controllers/realEstate.controller';

const realEstateRouter = express.Router();


realEstateRouter.route('/realEstateIntoCollection').post(
    (req, res) => new RealEstateController().insertRealEstateToTheCollection(req, res)
);


realEstateRouter.route('/getAllClientRealEstate').post(
    (req, res) => new RealEstateController().getAllRealEstatesForClient(req, res)
);


realEstateRouter.route('/markForRenovation').post(
    (req, res) => new RealEstateController().markForRenovation(req, res)
);


export default realEstateRouter;