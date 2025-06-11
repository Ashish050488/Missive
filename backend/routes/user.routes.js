import express from 'express';
import protectedRoute from '../middleware/protectedRoute.js';
import {
    getUsersForSideBar,
    getUserProfile,
    updateUserProfile
} from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/',protectedRoute,getUsersForSideBar); 

// Route to get a specific user's public profile
router.get('/profile/:userId', protectedRoute, getUserProfile);

// Route for the logged-in user to update their own profile
router.put('/profile', protectedRoute, updateUserProfile);

export default router;