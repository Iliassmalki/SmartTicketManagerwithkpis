import db from '../../models/index.js';
import { Op, where } from 'sequelize';
import Sequelize from 'sequelize';


export async function calculateAverageRating(eventId) {
  try {
    const result = await db.Review.findOne({
      where: { eventId },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']
      ],
      raw: true
    });
    return parseFloat(result.avgRating) || 0;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    throw error;
  }
}
export async function postreview(data) {
  try {
    const { userId, eventId, rating, comment } = data;
    const newReview = await db.Review.create({
      userId,
      eventId,
        rating,
      comment
    });
    return newReview;
  } catch (error) { 
    console.error("Error posting review:", error);
    throw error;
  }
}   
export async function getallreviewassorganizer(orguserId) {
    try {
        const reviews= db.Review.findAll( {where: {userId:orguserId} } )
        return reviews;
    }
    catch (error) {
        console.error("Error getting reviews for organizer:", error);
        throw error;
    }
}