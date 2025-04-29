import express from 'express';
import { authenticateUserToken } from '../middlewares/authServices.js';
import {getCurrentUser, updateAvatarController} from '../controllers/userControllers.js';
import { updateFieldController } from '../controllers/userControllers.js';
import { uploadAvatar } from '../config/multerUpload.js';
import { searchUser } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/me', authenticateUserToken,  getCurrentUser)

router.get('/validate-token', authenticateUserToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'token is valid',
        user: req.user
    })
})

router.post('/updateProfile/avatar', authenticateUserToken, uploadAvatar, updateAvatarController)

router.put('/updateProfile/:field', authenticateUserToken, updateFieldController)

router.get('/search', searchUser)

export default router;