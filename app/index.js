const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// In-memory data store
let bookings = [
  { id: 1, from: 'Delhi', to: 'Mumbai', vehicle: 'Truck', status: 'active', driver: 'Ravi Kumar', price: 15000 },
  { id: 2, from: 'Pune', to: 'Bangalore', vehicle: 'Mini Van', status: 'pending', driver: 'Suresh Yadav', price: 8000 },
];
let nextId = 3;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, data: bookings });
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: booking });
});

// Create new booking
app.post('/api/bookings', (req, res) => {
  const { from, to, vehicle, driver, price } = req.body;
  if (!from || !to || !vehicle) {
    return res.status(400).json({ success: false, message: 'from, to, and vehicle are required' });
  }
  const booking = { id: nextId++, from, to, vehicle, driver: driver || 'TBD', price: price || 0, status: 'pending' };
  bookings.push(booking);
  res.status(201).json({ success: true, data: booking });
});

// Update booking status
app.patch('/api/bookings/:id/status', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  booking.status = req.body.status || booking.status;
  res.json({ success: true, data: booking });
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  const idx = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
  bookings.splice(idx, 1);
  res.json({ success: true, message: 'Booking deleted' });
});

app.listen(PORT, () => {
  console.log(`🚚 Transporter App running on port ${PORT}`);
});

module.exports = app;
