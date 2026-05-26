const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing Gemini API Key:', apiKey);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

model.generateContent('Hello, reply with "Success!"')
  .then(result => {
    console.log('SUCCESS:', result.response.text());
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
