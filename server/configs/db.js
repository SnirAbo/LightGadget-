const mongoose = require('mongoose');
require('dotenv').config(); 
const connectDB = () => {
  // Connect to MongoDB database
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to gadgetlightDB'))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
