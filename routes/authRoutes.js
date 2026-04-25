const {Router}=require('express');
const authController=require('../controllers/authControllers');
const router=Router();

router.get('/', authController.landing_get);
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);

module.exports=router;