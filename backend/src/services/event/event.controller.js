
import express from 'express';
import eventService from './event.services.js';  // Correct


export default  async function getNearbyEvents(req,res){
      const lat=req.query.lat;
  const lng=req.query.lng;
  const radius=req.query.radius;
  const days=req.query.days;
  const limit=req.query.limit;
 const category=req.query.category;
  
  const maxDays = days ? parseInt(days) : 7;
  const maxLimit = limit ? parseInt(limit) : 20;
  const events = await eventService.findNearbyEventsByGPS(lat, lng,category, radius, maxDays, maxLimit,);
 if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng query parameters are required" });
    }
    console.log(`✅ Fetching nearby events for lat:${lat}, lng:${lng}, category:${category}`);
  res.json({
    count: events.length,
    events,
  });

  
}
export async function buyEvent(req, res) {
  try {
    // On prend tout depuis le body
    const { eventId } = req.body;
    const userId = req.user?.id; // ← venant de ton JWT (authMiddleware)

    // Validation stricte
    if (!eventId) {
      return res.status(400).json({
        message: "eventId est obligatoire dans le body"
      });
    }

    const eventIdNum = eventId; // On attend un UUID
   

    if (!userId) {
      return res.status(401).json({
        message: "Utilisateur non authentifié (JWT manquant ou invalide)"
      });
    }

    // Tout est bon → achat du ticket
    const result = await eventService.buyticketforEvent({
      eventId: eventIdNum,
      userId
    });

    return res.status(200).json(result);

  } catch (error) {
    console.error("Buy ticket error:", error.message);
    return res.status(500).json({
      message: error.message || "Échec de l'achat du ticket"
    });
  }
}
export async function getEventById(req, res) {
  try {
    const eventId = req.params.id;  
    const event = await eventService.getevenbyId({ eventId });

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error getting event by ID:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function createEvent(req, res) {
  try {
    // Get authenticated user ID from request (from middleware)
    const userId = req.user.id; // or req.userId depending on your auth setup
    
    // Get event data from request body
    const eventData = req.body;
    
    // Call the service with eventData and userId
    const newEvent = await eventService.createEventByOrganizer(eventData, userId);
    
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent
    });
  } catch (error) {
    console.error("Error in createEvent controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create event"
    });
  }
}
export async function geteventsbyorganizer(req, res) {
  try {
    // PROTECTION IMMÉDIATE
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const userId = req.user.id;
    console.log('Récupération événements pour userId:', userId); // LOG

    const events = await eventService.getEventsByOrganizer(userId);
    return res.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events by organizer:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}