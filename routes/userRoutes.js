const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const solicitacaoRouter = require('./solicitacaoRouter');

const router = express.Router();

router.get('/isLogged', authController.isLogged);
router.post('/signup', authController.siginup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete('/deleteMe', userController.deleteMe);

router.get('/me', userController.getMe, userController.getUser);

router.use(
  '/:userId/solicitacaos/:perfilCode',
  authController.restrictTo(0, 1),
  solicitacaoRouter
);

router
  .route('/')
  .get(authController.restrictTo(0, 1), userController.getAllUsers) // API to get All Users
  .post(authController.restrictTo(0), userController.createUser); // Criar API para api que cria uma nova User

router
  .route('/:id')
  .get(authController.restrictTo(0), userController.getUser) // API to get User sending a id by parameter (id)
  .patch(
    authController.restrictTo(0),
    userController.getRoleById,
    userController.updateUser
  ) // API to update User sending a id by parameter (id)
  .delete(authController.restrictTo(0), userController.deleteUser); // API to delete User sending a id by parameter (id)

module.exports = router;
