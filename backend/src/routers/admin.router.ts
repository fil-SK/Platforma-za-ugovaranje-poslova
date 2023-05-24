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


export default adminRouter;