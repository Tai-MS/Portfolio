import express from 'express';
import userController from '../controllers/user.controller.js';
import { generateToken, verifyToken, revokeToken } from '../middlewares/auth.js';
import { __dirname, constants } from '../utils.js';
import { storage, upload } from '../utils/storage.js';
import passport from 'passport';
import initializePassport from '../config/passport.config.js';
import path from 'path';
import { addLogger } from '../utils/logger.js';


const router = express.Router();

initializePassport();
router.use(passport.initialize());
router.use(passport.session());
const loggerMiddleware = (req, res, next) => {
    addLogger(req, res, next); 
  };
  router.use(loggerMiddleware);
router.post('/signup', userController.createUser);

router.post('/login', generateToken, userController.login);

router.post('/logout', verifyToken, userController.logout, revokeToken);

router.put('/updateUser', verifyToken, userController.updateUser);

router.post('/reqchangepass', generateToken, userController.reqChangePassword);

router.post('/changePass/:token', verifyToken, userController.changePassword);

router.put('/changerole', verifyToken, userController.changeRole);

router.use('/documents', express.static(path.join(__dirname, 'multer')));

router.post('/documents', verifyToken, upload.single('file'), userController.upload);

router.get('/auth/github', generateToken, passport.authenticate('github', { scope: ['user:email'] }));

router.delete('/deleteUser', verifyToken, userController.deleteUser)

router.get('/auth/github/callback',userController.loginPassportGH)

router.delete('/deleteinactive', verifyToken, userController.deleteInactive)

export default router;
