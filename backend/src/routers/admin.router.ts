import express from 'express';

import { AdminController } from '../controllers/admin.controller';


const adminRouter = express.Router();



adminRouter.route('/getAllClients').get(
    (req, res) => new AdminController().getAllClients(req, res)
);


adminRouter.route('/getAllAgencies').get(
    (req, res) => new AdminController().getAllAgencies(req, res)    
);


adminRouter.route('/getPendingClients').get(
    (req, res) => new AdminController().getPendingClients(req, res)
);


adminRouter.route('/getPendingAgencies').get(
    (req, res) => new AdminController().getPendingAgencies(req, res)
);


adminRouter.route('/changePassword').post(
    (req, res) => new AdminController().changePassword(req, res)
);


adminRouter.route('/acceptClient').post(
    (req, res) => new AdminController().acceptClient(req, res)
);


adminRouter.route('/declineClient').post(
    (req, res) => new AdminController().declineClient(req, res)
);


adminRouter.route('/acceptAgency').post(
    (req, res) => new AdminController().acceptAgency(req, res)
);


adminRouter.route('/declineAgency').post(
    (req, res) => new AdminController().declineAgency(req, res)
);


adminRouter.route('/getLastWorkerId').get(
    (req, res) => new AdminController().getLastWorkerId(req, res)
);


adminRouter.route('/insertNewLastWorkerId').post(
    (req, res) => new AdminController().insertNewLastWorkerId(req ,res)
);

adminRouter.route('/insertNewWorker').post(
    (req, res) => new AdminController().insertNewWorkerIntoDatabase(req, res)
);


adminRouter.route('/deleteClient').post(
    (req, res) => new AdminController().deleteClientWithUsername(req, res)
);


adminRouter.route('/updateClientInDB').post(
    (req, res) => new AdminController().updateClientWithUsername(req, res)
);


adminRouter.route('/deleteAgencyFromDB').post(
    (req, res) => new AdminController().deleteAgencyWithUsername(req, res)
);


adminRouter.route('/updateAgencyFromDB').post(
    (req, res) => new AdminController().updateAgencyWithUsername(req, res)
);


adminRouter.route('/adminRegisteringUser').post(
    (req, res) => new AdminController().setRegStatusToAccepted(req, res)
);


export default adminRouter;