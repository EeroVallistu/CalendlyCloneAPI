const db = require('./db');

// Insert example users
db.serialize(() => {
  // Clear existing data
  db.run('DELETE FROM users');
  db.run('DELETE FROM events');
  db.run('DELETE FROM schedules');

  // Insert users
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', timezone: 'UTC' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', timezone: 'EST' }
  ];

  const insertUser = db.prepare('INSERT INTO users (id, name, email, timezone) VALUES (?, ?, ?, ?)');
  users.forEach(user => {
    insertUser.run(user.id, user.name, user.email, user.timezone);
  });
  insertUser.finalize();

  // Insert events
  const events = [
    { id: '101', name: 'Team Meeting', duration: 30, description: 'Daily standup', color: '#FF0000' },
    { id: '102', name: 'Client Call', duration: 60, description: 'Monthly review', color: '#00FF00' }
  ];

  const insertEvent = db.prepare('INSERT INTO events (id, name, duration, description, color) VALUES (?, ?, ?, ?, ?)');
  events.forEach(event => {
    insertEvent.run(event.id, event.name, event.duration, event.description, event.color);
  });
  insertEvent.finalize();

  // Insert schedules
  const schedules = [
    { userId: '1', availability: JSON.stringify([{ day: 'monday', startTime: '09:00', endTime: '17:00' }]) }
  ];

  const insertSchedule = db.prepare('INSERT INTO schedules (userId, availability) VALUES (?, ?)');
  schedules.forEach(schedule => {
    insertSchedule.run(schedule.userId, schedule.availability);
  });
  insertSchedule.finalize();

  // Add this to the db.serialize() block
  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    userId TEXT NOT NULL,
    inviteeEmail TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    FOREIGN KEY (eventId) REFERENCES events(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);

  console.log('Database seeded successfully!');
});

db.close(); 