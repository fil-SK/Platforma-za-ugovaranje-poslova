import express, { RequestHandler } from 'express';

// Necessary imports
import cors from 'cors';
import mongoose from 'mongoose'; 

import multer from 'multer';

import clientRouter from './routers/client.router';
import agencyRouter from './routers/agency.router';

// ------------------------- Necessary usage -----------------------
const app = express();
app.use(cors());
app.use(express.json());

// --------------------- Necessary usage end -----------------------

app.use(express.urlencoded({ extended: true }));    // Enables passing of URL encoded data


// ---------------------- Database connection ----------------------
mongoose.connect('mongodb://127.0.0.1:27017/agencyDB');
const connection = mongoose.connection;
connection.once('open', () => {console.log('Successfully connected to database!')} );

// ------------------- Database connection end ---------------------


// -------------- Multer dependency for storing files --------------

/*
const storage = multer.diskStorage(
    {
        destination : (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename : (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
        }
    }
);

 const upload = multer({storage : storage});

app.use(upload.single('image'));
*/


// --------------------------- Multer end --------------------------



// ---------------------------- Routers ----------------------------
const router = express.Router();

router.use('/client', clientRouter);
router.use('/agency', agencyRouter);

app.use('/', router);

// ---------------------------- Routers end ----------------------------

app.listen(4000, () => console.log(`Express server running on port 4000`));