import express from "express";
import { authenticate } from '../../middlewares/auth.js';
import ticketController from "./ticket.controller.js";
const TicketRouter= express.Router();



        TicketRouter.get("/getbyuser", authenticate, ticketController.getPurchasesByUser);

        export default TicketRouter;