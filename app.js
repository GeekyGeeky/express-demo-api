const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const controllers = require('./controllers');

/**
 * 
 * yes something simple. 
 * sign up 
 *  sign in (post requests), 
 * update name
 * fetch profile
 */

const PORT = process.env.PORT || 9000;
const app = express();
app.use(cors())
app.use(express.json())


app.use('/api', controllers)


mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true, useUnifiedTopology: true
});

const server = app.listen(PORT, () => {
    console.log(`REST API on http://localhost:${PORT}/api/v1`);
  });
