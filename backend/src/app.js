import eventrouter from './services/event/event.routes.js';
import router from './authroutes/authroutes.js';
import express from 'express';
import userrouter   from './services/user/user.route.js';
import purchaserouter from './services/purchases/purchase.route.js';
import ticketRoute from './services/ticket/ticket.route.js';
const app = express();

// Middlewares
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('API running');
});
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});
app.use('/auth', router);
// GET /events/nearby?lat=33.561&lng=-7.626
app.use('/events',eventrouter)
app.use('/users',userrouter)
app.use('/purchases',purchaserouter)
app.use('/tickets',ticketRoute)
export default app;
