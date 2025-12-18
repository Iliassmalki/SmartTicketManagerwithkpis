// src/services/user/user.service.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import dotenv from 'dotenv';
import catchAsync from '../../middlewares/catchasyn.js';
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

export default {
 async getAll() {
    
       return db.User.findAll({ attributes: { exclude: ['password'] } });  
  },
    async getById(id) {
    return db.User.findByPk(id, { attributes: { exclude: ['password'] } });
  },    
};