import express from 'express';
import { sendMessage,getMessages} from "../controllers/message.controllers.js";
import protectedRoute from '../middleware/protectedRoute.js'




const router = express.Router();

router.get('/:id',protectedRoute,getMessages)
router.post('/send/:id',protectedRoute,sendMessage)



export default router;