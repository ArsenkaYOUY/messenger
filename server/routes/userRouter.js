import express from 'express';
import { authenticateUserToken } from '../middlewares/authServices.js';
import {getCurrentUser, updateAvatarController} from '../controllers/userControllers.js';
import { updateFieldController } from '../controllers/userControllers.js';
import { uploadAvatar } from '../config/multerUpload.js';

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

router.put('/updateProfile/username', authenticateUserToken, updateFieldController)

router.put('/updateProfile/fullname', authenticateUserToken, updateFieldController)

router.put('/updateProfile/email', authenticateUserToken, updateFieldController)


router.put('/updateProfile/about', authenticateUserToken, updateFieldController)

export default router;