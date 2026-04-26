const {createClient} = require('redis');
const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.connect().catch(err => console.error('Redis connection error:', err));

module.exports = client;
