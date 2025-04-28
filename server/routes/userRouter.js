import express from 'express';
import { authenticateUserToken } from '../middlewares/authServices.js';
import { getCurrentUser } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/me', authenticateUserToken,  getCurrentUser)

router.get('/validate-token', authenticateUserToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'token is valid',
        user: req.user
    })
})

router.post('/updateProfile/avatar', authenticateUserToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: '',
        user: req.user
    })
})

router.put('/updateProfile/username', authenticateUserToken, (req, res) => {
    setTimeout( () => {
        return res.status(200).json({
            success: true,
            message: 'Такой username уже используется',
            user: req.user
        })
    }, 1000)


})

router.put('/updateProfile/fullname', authenticateUserToken, (req, res) => {
    setTimeout( () => {
        return res.status(200).json({
            success: true,
            message: 'Такой username уже используется',
            user: req.user
        })
    }, 1000)
})

router.put('/updateProfile/email', authenticateUserToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'token is valid',
        user: req.user
    })
})


router.put('/updateProfile/about', authenticateUserToken, (req, res) => {
    return res.status(400).json({
        success: true,
        message: 'token is valid',
        user: req.user
    })
})

export default router;