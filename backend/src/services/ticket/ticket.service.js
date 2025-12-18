import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import { Op, or } from 'sequelize';
import Sequelize from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
dotenv.config();
export default {
   async createTicket({ eventId, userId,eventPrice }) {
    const maxRetries = 5;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Vérification event + user
            const event = await db.Event.findByPk(eventId);
            const user = await db.User.findByPk(userId);
            const tprice=eventPrice;

            if (!event) throw new Error('Event not found');
            if (!user) throw new Error('User not found');

            // Génération d'un code unique très fort (UUID v4 + timestamp)
            const uniqueCode = `${uuidv4()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Génération du QR code en Data URL (base64)
            const qrCodeDataUrl = await QRCode.toDataURL(uniqueCode);
            await db.Purchases.create({
              eventId: event.id,
                userId: user.id,
            });
            // Création du ticket avec le QR code
            const ticket = await db.Ticket.create({
                eventId: event.id,
                userId: user.id,
                qrCode: qrCodeDataUrl,
                price:tprice,
                date: new Date()
            });

            // Si on arrive ici → succès !
            return {
                ...ticket.toJSON(),
                qrCodeDataUrl,          
                qrCodeImage: qrCodeDataUrl  
            };

        } catch (error) {
            // Cas spécifique : violation d'unicité sur qrCode (très rare mais possible)
            if (error.name === 'SequelizeUniqueConstraintError' && attempt < maxRetries - 1) {
                console.warn(`QR code collision, retrying... (attempt ${attempt + 1})`);
                continue; // on réessaie
            }

            // Toutes les autres erreurs (ou trop de tentatives)
            console.error('Error creating ticket:', error);
            console.log('price:',eventPrice);
            throw error;
        }
    }

    throw new Error('Failed to generate unique QR code after multiple attempts');
},
async getTicketsByUser( userId ) {
  console.log('Fetching tickets for userId:', userId);
    try {
      const tickets = await db.Ticket.findAll({ 
        where: { userId },
        include: [{ model: db.Event, as: 'event' }]
      });
      return tickets;
    } catch (error) {
      console.error("Error getting tickets by user:", error);   
        throw error;    
    }
  }
};