import express, { RequestHandler } from 'express';

// Necessary imports
import cors from 'cors';
import mongoose from 'mongoose'; 

import multer from 'multer';

import clientRouter from './routers/client.router';
import agencyRouter from './routers/agency.router';
import adminRouter from './routers/admin.router';
import realEstateRouter from './routers/realEstate.router';

// ------------------------- Necessary usage -----------------------
const app = express();
app.use(cors());
app.use(express.json());

// --------------------- Necessary usage end -----------------------

app.use(express.urlencoded({ extended: true }));    // Enables passing of URL encoded data

app.use('/uploads', express.static('uploads'));     // This line is going to allow frontend to fetch the image from the backend server

// ---------------------- Database connection ----------------------
mongoose.connect('mongodb://127.0.0.1:27017/agencyDB');
const connection = mongoose.connection;
connection.once('open', () => {console.log('Successfully connected to database!')} );

// ------------------- Database connection end ---------------------



// ---------------------------- Routers ----------------------------
const router = express.Router();

router.use('/client', clientRouter);
router.use('/agency', agencyRouter);
router.use('/admin', adminRouter);
router.use('/realEstate', realEstateRouter);


app.use('/', router);

// ---------------------------- Routers end ----------------------------

app.listen(4000, () => console.log(`Express server running on port 4000`));