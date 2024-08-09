
import express from 'express'
import { generateToken, verifyToken, revokeToken } from '../middlewares/auth.js'
import cartClass from '../persistence/carts.persistence.js'
import passport from 'passport';
import session from 'express-session';
import { addLogger } from '../utils/logger.js';
import initializePassport from '../config/passport.config.js';
import userController from '../controllers/user.controller.js';
const router = express.Router()

initializePassport();
router.use(passport.initialize());
router.use(passport.session());

const loggerMiddleware = (req, res, next) => {
    addLogger(req, res, next); 
  };
  router.use(loggerMiddleware);

router.get('/products', verifyToken, async(req, res, next) => {
    const token = req.user.email
    const user = await cartClass.getCart(token);
    console.log('user views', user);
    res.render('products',  {token});
});

router.get('/', generateToken, async(req, res, next) => {
    res.render('login');
});

router.get('/signup', async(req, res, next) => {
    res.render('signup');
});

router.get('/reqchangepass', async(req, res, next) => {
    res.render('reqchangepass')
})

router.get('/changepass/:token', async(req, res, next) => {
    const token = req.params.token
    res.render('changepass', {token})
})

router.get('/upload', verifyToken, (req, res, next) => {
    res.render('upload')
})

router.get('/cart', verifyToken, async(req, res, next) => {
    const token = req.user.email
    const user = await cartClass.getCart(token);
    res.render('cart', { user: JSON.stringify(user) });
});

router.get('/allusers', verifyToken, userController.getAll);

router.get('/faillogin', (req, res, next) => {
    res.render('faillogin')
})

export default router;
