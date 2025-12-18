import ticketService from "./ticket.service.js";

export default {
async  getPurchasesByUser(req, res) {
  try {
    // PROTECTION IMMÉDIATE
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }
    const userId = req.user.id;
    console.log("User ID in controller:", userId);
    const purchases = await ticketService.getTicketsByUser(userId);
    return res.status(200).json(purchases);
  } catch (error) {
    console.error("Error getting purchases by user:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  } 
}
}