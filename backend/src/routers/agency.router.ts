import express from 'express';
import { AgencyController } from '../controllers/agency.controller';


import multer from 'multer';


const agencyRouter = express.Router();


agencyRouter.route('/verifyAgencyUnique').post(
    (req, res) => new AgencyController().verifyAgencyUnique(req, res)
);


agencyRouter.route('/registerAgency').post(
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
    (req, res) => new AgencyController().registerAgency(req, res)
);


agencyRouter.route('/loginAgency').post(
    (req, res) => new AgencyController().loginAgency(req, res)
);


agencyRouter.route('/changePassword').post(
    (req, res) => new AgencyController().changePassword(req, res)
);


agencyRouter.route('/getAgencyWithUsername').post(
    (req, res) => new AgencyController().getAgencyWithUsername(req, res)
);


agencyRouter.route('/getAllRequestsForThisAgency').post(
    (req, res) => new AgencyController().getAllRequestsForThisAgency(req, res)
);


agencyRouter.route('/acceptClientRequest').post(
    (req, res) => new AgencyController().acceptClientRequest(req, res)
);


agencyRouter.route('/declineClientRequest').post(
    (req, res) => new AgencyController().declineClientRequest(req, res)
);


agencyRouter.route('/getActiveJobsForAgency').post(
    (req, res) => new AgencyController().getAllActiveJobsForThisAgency(req, res)
);


agencyRouter.route('/changeRoomColor').post(
    (req, res) => new AgencyController().changeRoomColor(req, res)
);


agencyRouter.route('/setAgencyDone').post(
    (req, res) => new AgencyController().setAgencyDone(req, res)
);


agencyRouter.route('/getAllWorkersAsObjects').post(
    (req, res) => new AgencyController().getAllWorkerObjectsForAgency(req, res)
);


agencyRouter.route('/assignWorkersToRequest').post(
    (req, res) => new AgencyController().assignCollectedWorkersToTheRequest(req ,res)
);


agencyRouter.route('/deleteWorkersFromAgency').post(
    (req, res) => new AgencyController().deleteWorkersFromAgency(req, res)
);


agencyRouter.route('/releaseWorkersFromJob').post(
    (req, res) => new AgencyController().releaseWorkersFromJob(req, res)
);


export default agencyRouter;