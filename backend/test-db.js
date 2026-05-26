const mongoose = require('mongoose');

const mongoUri = 'mongodb://127.0.0.1:27017/vedaai';

console.log('Testing connection to:', mongoUri);
mongoose.connect(mongoUri, {
  connectTimeoutMS: 2000,
  serverSelectionTimeoutMS: 2000
})
.then(() => {
  console.log('SUCCESS: Connected to MongoDB!');
  process.exit(0);
})
.catch(err => {
  console.error('ERROR: Failed to connect to MongoDB:', err);
  process.exit(1);
});
