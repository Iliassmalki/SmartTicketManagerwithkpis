
import purchase from "../../models/purchase"
import db from '../../models/index.js';
import { Op, or } from 'sequelize';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { validate as uuidValidate } from 'uuid';
import ticketService from '../ticket/ticket.service.js';
dotenv.config();

export default {

async  getPurchasesByUser(userId) {
    try {
        const purchases = await db.Purchases.findAll({
            where: { user_id: userId }
        });
        return purchases;
    }
    catch (error) {
        console.error("Error getting purchases by user:", error);
        throw error;
    }
}

}