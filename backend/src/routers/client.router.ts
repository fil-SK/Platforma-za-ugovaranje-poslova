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
    (req, res) => new ClientController().changePassword(req, res)
);


clientRouter.route('/getId').get(
    (req, res) => new ClientController().getLastRoomAndRealEstateId(req, res)
);


clientRouter.route('/updateId').post(
    (req, res) => new ClientController().insertNewLastUsedRoomAndRealEstateId(req, res)
);


clientRouter.route('/addNewRealEstate').post(
    (req, res) => new ClientController().insertRealEstateToClient(req, res)
);


clientRouter.route('/uploadJSONSchema').post(
    multer({
        storage : multer.diskStorage(
            {
                destination : (req, file, cb) => {
                    cb(null, 'uploads/');
                }
            })
    }).single('jsonSchema'),
    (req, res) => new ClientController().extractFromUploadedJSON(req, res)
);


clientRouter.route('/getAllAgencies').get(
    (req, res) => new ClientController().getAllAgencies(req, res)
);


clientRouter.route('/searchAgencyByName').post(
    (req, res) => new ClientController().searchAgencyByName(req, res)
);


clientRouter.route('/searchAgencyByAddress').post(
    (req, res) => new ClientController().searchAgencyByAddress(req, res)
);


clientRouter.route('/searchAgencyByNameAndAddress').post(
    (req, res) => new ClientController().searchAgencyByNameAndAddress(req, res)
);


clientRouter.route('/getLastRequestId').get(
    (req, res) => new ClientController().getLastRequestId(req, res)
);


clientRouter.route('/makeRequest').post(
    (req, res) => new ClientController().makeRequest(req, res)
);


clientRouter.route('/insertNewRequestId').post(
    (req, res) => new ClientController().insertNewRequestId(req, res)
);


clientRouter.route('/getAllRequestsForClient').post(
    (req, res) => new ClientController().getAllRequestsForUser(req, res)
);


clientRouter.route('/getClientWithThisUsername').post(
    (req, res) => new ClientController().getClientWithThisUsername(req, res)
);


clientRouter.route('/getRequestWithId').post(
    (req, res) => new ClientController().getRequestWithThisId(req, res)
);


clientRouter.route('/acceptOffer').post(
    (req, res) => new ClientController().clientAcceptAgencyOffer(req, res)
);


clientRouter.route('/rejectOffer').post(
    (req, res) => new ClientController().clientRejectAgencyOffer(req ,res)
);


clientRouter.route('/setRequestAsCompleted').post(
    (req, res) => new ClientController().markRequestAsCompleted(req, res)
);


clientRouter.route('/insertReview').post(
    (req, res) => new ClientController().insertReview(req, res)
);


clientRouter.route('/deleteReview').post(
    (req, res) => new ClientController().deleteReview(req, res)
);



export default clientRouter;