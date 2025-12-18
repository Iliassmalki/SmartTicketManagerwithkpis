import express from 'express';


import catchAsync from '../../middlewares/catchasyn.js';
import  getNearbyEvents, { buyEvent,getEventById,createEvent,geteventsbyorganizer}  from "../event/event.controller.js";

import event from '../../models/event.js';
import { authenticate } from '../../middlewares/auth.js';

const eventrouter = express.Router();

// GET /events/nearby?lat=33.561&lng=-7.626
eventrouter.get("/nearby", getNearbyEvents);
eventrouter.get("/my", authenticate, geteventsbyorganizer);      // ← AVANT /:id
eventrouter.get("/:id", getEventById);                            // ← APRÈS /my
eventrouter.post("/create", authenticate, createEvent);
eventrouter.post("/buy", authenticate, buyEvent);
export default eventrouter;
