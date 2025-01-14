import express from 'express';
import protectedRoute from '../middleware/protectedRoute.js';
import { getUsersForSideBar } from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/',protectedRoute,getUsersForSideBar); 

export default router;