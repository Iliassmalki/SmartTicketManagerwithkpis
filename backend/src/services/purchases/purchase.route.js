//import purchaseController from "./purchase.controller";
import express from "express";
import { authenticate } from '../../middlewares/auth.js';
const purchaserouter = express.Router();

//purchaserouter.get("/getbyuser", authenticate, purchaseController.getPurchasesByUser);

export default purchaserouter;