const request = require('supertest');
const app = require('../app/index');

describe('Transporter App - API Tests', () => {

  describe('GET /health', () => {
    it('should return status OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/bookings', () => {
    it('should return all bookings', async () => {
      const res = await request(app).get('/api/bookings');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/bookings', () => {
    it('should create a new booking', async () => {
      const newBooking = { from: 'Lucknow', to: 'Delhi', vehicle: 'Truck', driver: 'Anil Singh', price: 9000 };
      const res = await request(app).post('/api/bookings').send(newBooking);
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.from).toBe('Lucknow');
      expect(res.body.data.status).toBe('pending');
    });

    it('should return 400 if required fields missing', async () => {
      const res = await request(app).post('/api/bookings').send({ from: 'Delhi' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should return booking by ID', async () => {
      const res = await request(app).get('/api/bookings/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe(1);
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app).get('/api/bookings/9999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/bookings/:id/status', () => {
    it('should update booking status', async () => {
      const res = await request(app).patch('/api/bookings/1/status').send({ status: 'completed' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('completed');
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should delete a booking', async () => {
      const res = await request(app).delete('/api/bookings/2');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 when deleting non-existent booking', async () => {
      const res = await request(app).delete('/api/bookings/9999');
      expect(res.statusCode).toBe(404);
    });
  });

});
