'use strict';

import express from 'express';
const userrouter = express.Router();

import userController from './user.controller.js';
import { authenticate  } from '../../middlewares/auth.js';
import { authorizeRoles } from '../../middlewares/auth.js';
import catchAsync from '../../middlewares/catchasyn.js';


// PROTECTED ROUTES (any authenticated user)
userrouter.get('/me', authenticate, async (req, res) => {
    const user = await userController.getById({ params: { id: req.user.id } }, res);
});

userrouter.get(
  '/all',
  authenticate,                    // ← checks JWT
  authorizeRoles('admin'),         // ← checks role
 userController.getall// ← wraps the async controller
);

// GET ONE USER
//userrouter.get('/:id',authorizeRoles("admin"), authenticate, userController.getById);

// UPDATE PROFILE OR DATA
//userrouter.put('/:id', authenticate, userController.updateById);

// CHANGE PASSWORD
//userrouter.put('/change-password/me', authenticate, userController.changePassword);

// DELETE USER (Admin only)
//userrouter.delete('/:id', authenticate,authorizeRoles("admin"), userController.deleteUser);

// UPDATE ROLE (Admin only)
//userrouter.put('/:id/role',authorizeRoles("admin"), authenticate, userController.updateRole);

export default userrouter;
