import express from 'express';

import { AdminController } from '../controllers/admin.controller';


const adminRouter = express.Router();



adminRouter.route('/getAllClients').get(
    (req, res) => new AdminController().getAllClients(req, res)
);

adminRouter.route('/getAllAgencies').get(
    (req, res) => new AdminController().getAllAgencies(req, res)    
);



export default adminRouter;