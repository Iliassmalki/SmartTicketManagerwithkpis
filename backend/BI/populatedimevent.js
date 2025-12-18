async function populateDimEvent() {
  const events = await Event.findAll();

  for (const e of events) {
    await DimEvent.upsert({
      eventId: e.id,
      name: e.name,
      category: e.category,
      location: e.location,
      price: e.price
    });
  }

  console.log("✅ dim_event remplie !");
}
