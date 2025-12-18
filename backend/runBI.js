import { populateDimEvent } from './populateDimEvent.js';
import { populateDimUser } from './populateDimUser.js';
import { populateDimDate } from './populateDimDate.js';
import { populateFactTicketSales } from './populateFactTicketSales.js';

async function runAll() {
  await populateDimEvent();
  await populateDimUser();
  await populateDimDate();
  await populateFactTicketSales();

  console.log("🎉 BI mise à jour avec succès !");
}

runAll();
