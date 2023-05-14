import express from 'express';

// Necessary imports
import cors from 'cors';
import mongoose from 'mongoose'; 
import clientRouter from './routers/client.router';
import agencyRouter from './routers/agency.router';


const app = express();
app.use(cors());
app.use(express.json());


// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/agencyDB');
const connection = mongoose.connection;
connection.once('open', () => {console.log('Successfully connected to database!')} );


// Routers
const router = express.Router();

router.use('/client', clientRouter);
router.use('/agency', agencyRouter);

app.use('/', router);


app.listen(4000, () => console.log(`Express server running on port 4000`));