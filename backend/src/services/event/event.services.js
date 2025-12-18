// src/services/event/event.service.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import { Op, or } from 'sequelize';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { validate as uuidValidate } from 'uuid';
import ticketService from '../ticket/ticket.service.js';
import event from '../../models/event.js';
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

export default {
async findNearbyEventsByGPS(
  userLat,
  userLng,
  category ,
  radiusKm = 15,
  days = 7,
  limit = 20,
  page = 1,
  
) {
  try {
    console.log('Fetching nearby events for lat:', userLat, 'lng:', userLng, 'category:', category);

    if (!userLat || !userLng) {
      throw new Error("Latitude et longitude requises");
    }

    const safeLimit = Math.min(Number(limit) || 20, 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const now = new Date();
    const futureDate = new Date(now.getTime() + (days || 7) * 24 * 60 * 60 * 1000);

    const distanceExpression = `
      6371 * acos(
        GREATEST(-1, LEAST(1,
          cos(radians(:lat)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(latitude))
        ))
      )
    `;

    // ON CONSTRUIT LE WHERE CORRECTEMENT
    const whereCondition = {
      startDate: { [Op.between]: [now, futureDate] },
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
      [Op.and]: Sequelize.literal(`${distanceExpression} <= :radiusKm`)
    };

    // AJOUT DE LA CATÉGORIE (LE POINT CRITIQUE)
    if (category && typeof category === 'string' && category.trim() !== '') {
      const cleanCategory = category.trim().toUpperCase();
 whereCondition.category = category.trim();
      console.log('Filtre catégorie appliqué :', cleanCategory);
    } else {
      console.log('Aucun filtre catégorie');
    }

    console.log('Where final →', JSON.stringify(whereCondition, null, 2));

    const events = await db.Event.findAll({
      where: whereCondition,
      replacements: {
        lat: Number(userLat),
        lng: Number(userLng),
        radiusKm: Number(radiusKm)
      },
      attributes: [
        'id', 'name', 'price', 'startDate', 'picture', 'location',
        'latitude', 'longitude', 'category',
        [Sequelize.literal(distanceExpression), 'distanceKm']
      ],
      limit: safeLimit,
      offset,
      order: [['startDate', 'ASC']]
    });

    return {
      data: events.map(e => ({
        ...e.toJSON(),
        distanceKm: Number(e.getDataValue('distanceKm') || 0).toFixed(2)
      })),
      pagination: { page: safePage, limit: safeLimit, hasMore: events.length === safeLimit }
    };

  } catch (error) {
    console.error('Error in findNearbyEventsByGPS:', error.message);
    throw error;
  }
}

,

  async getAllEvents() {
    try {
      const events = await db.Event.findAll();
      return events;
    } catch (error) {
      console.error("Error getting all events for admin", error);
      throw error;
    }
  },
  async getevenbyId({ eventId }) {
    try {
      const event = await db.Event.findByPk(eventId);
      return event;
    } catch (error) {
      console.error("Error getting event by ID:", error);
      throw error;
    }
  },
    

async getEventsByOrganizer(organizerId) {
  try {
    console.log("Fetching events for organizer ID:", organizerId);

    const events = await db.Event.findAll({
      where: { user_id: organizerId }
    });

    return events;
  } catch (error) {
    console.error("Error getting events by organizer:", error);
    throw error;
  }
},

  async deleteEventByOrganizer({ eventId, organizerId }) {
    try {
      const deletedCount = await db.Event.destroy({
        where: { id: eventId, userId: organizerId }
      });
      return deletedCount;
    } catch (error) {
      console.error("Error deleting event by organizer:", error);
      throw error;
    }
  },

  async deleteEventByAdmin({ eventId }) {
    try {
      const deletedCount = await db.Event.destroy({
        where: { id: eventId }
      });
      return deletedCount;
    } catch (error) {
      console.error("Error deleting event by admin:", error);
      throw error;
    }
  },

  async createEventByOrganizer(eventData, userId) {
  try {
    // Validate required fields
    if (!eventData.name || !eventData.description || !eventData.price || !eventData.startDate) {
      throw new Error("Missing required fields: name, description, price, startDate");
    }

    if (!eventData.lat || !eventData.long) {
      throw new Error("Missing location coordinates: lat, long");
    }

    if (!userId) {
      throw new Error("User is required");
    }

    // Prepare the event data with all fields
    const eventToCreate = {
      name: eventData.name,
      category: eventData.category || 'OTHER',
      location: eventData.location || 'Casablanca',
      description: eventData.description,
      price: parseFloat(eventData.price), // Ensure price is a number
      startDate: new Date(eventData.startDate), // Convert to Date object
      latitude: parseFloat(eventData.la), // Assuming your DB field is 'latitude'
      longitude: parseFloat(eventData.longitude), // Assuming your DB field is 'longitude'
      userId: userId, // Set the authenticated user's ID
      // Add any other default fields if needed
      status: 'ACTIVE', // Example: default status
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create the event in database
   
    const newEvent = await db.Event.create(eventToCreate);
    
    console.log("New event created:", newEvent);
    
    return newEvent;
  } catch (error) {
    console.error("Error creating event by organizer:", error);
    throw error;
  }
},
async  buyticketforEvent  ({ eventId, userId })  {
  try {
    console.log(' Démarrage achat ticket');
    console.log('eventId reçu :', eventId);
    console.log('userId reçu  :', userId);

    // Validation UUID
    if (!eventId || !uuidValidate(eventId)) {
      console.error('eventId invalide ou manquant');
      throw new Error('eventId doit être un UUID valide');
    }
    if (!userId || !uuidValidate(userId)) {
      console.error('userId invalide ou manquant');
      throw new Error('userId invalide');
    }

    // Récupération de l'événement (SANS include qui casse les colonnes !)
    console.log('Recherche de l\'événement...');
    const event = await db.Event.findByPk(eventId);

    if (!event) {
      console.error('Événement non trouvé → ID:', eventId);
      throw new Error('Événement introuvable');
    }

    console.log('Événement trouvé →', {
      id: event.id,
      name: event.name,
      price: event.price,
      userId: event.userId
    });

    // Vérification utilisateur
    console.log('Recherche de l\'utilisateur...');
    const user = await db.User.findByPk(userId);
    if (!user) {
      console.error('Utilisateur non trouvé → ID:', userId);
      throw new Error('Utilisateur introuvable');
    }
    console.log('Utilisateur trouvé →', user.email);

    // Création du ticket + QR code
   console.log('Création du ticket et QR code...');
    const ticketData = await ticketService.createTicket({
      eventId,
      userId,
      eventPrice: event.price
    });
    console.log('Ticket créé → ID:', ticketData.id);

    // Tout en parallèle (rapide et fiable)
    console.log('Mise à jour des relations et compteur...');
    await Promise.all([
      event.addPurchasers(user), // ajoute dans la table Purchases
      db.User.increment('nbticketssold', {
        by: 1,
        where: { id: event.userId }
      }).then(() => console.log('nbticketssold incrémenté pour l\'organisateur')),
      db.User.increment('revenue', {
        by: event.price,
        where: { id: event.userId }
      }).then(() => console.log('revenue mis à jour pour l\'organisateur')),
     
    ]);

    // Réponse finale
    console.log('Achat terminé avec succès !');
    return {
      success: true,
      message: 'Ticket acheté avec succès !',
      ticket: {
        id: ticketData.id,
        eventId: event.id,
        eventName: event.name,
        price: event.price,
        qrCodeImage: ticketData.qrCodeImage,
        createdAt: ticketData.createdAt
      }
    };

  } catch (error) {
    console.error('ERREUR FATALE lors de l\'achat du ticket :', {
      message: error.message,
      stack: error.stack,
      eventId,
      userId
    });
    throw error; // on laisse Express gérer le 400/500
  }
}
};