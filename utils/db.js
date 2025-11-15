// src/utils/db.js
// Simple in-memory database for now (replace with real DB in production)
class SimpleDB {
  constructor() {
    this.data = new Map();
  }
  
  async set(key, value) {
    this.data.set(key, value);
    return value;
  }
  
  async get(key) {
    return this.data.get(key);
  }
  
  async delete(key) {
    return this.data.delete(key);
  }
}

const db = new SimpleDB();
export default db;
