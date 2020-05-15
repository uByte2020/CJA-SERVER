const express = require('express');
const profileController = require('./../controllers/profileController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(profileController.getAllProfiles)
  .post(
    authController.protect,
    authController.restrictTo(0),
    profileController.generatePerfilCode,
    profileController.createProfile
  );

router.use(authController.protect, authController.restrictTo(0));

router
  .route('/:id')
  .get(profileController.getProfile)
  .patch(profileController.updateProfile)
  .delete(profileController.deleteProfile);

router
  .route('/:id/modalidades')
  .patch(
    profileController.validateModalidadeFild,
    profileController.addModalidades
  )
  .delete(
    profileController.validateModalidadeFild,
    profileController.removeModalidade
  );

module.exports = router;
