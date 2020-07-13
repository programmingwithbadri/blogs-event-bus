const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Event data store
const events = [];

// Will be called by other microservices when new event occurs
app.post('/events', (req, res) => {
  const event = req.body;

  // Push the event to data store
  events.push(event);

  // Pass the event to posts service
  axios.post('http://localhost:4000/events', event);

  // Pass the event to comments service
  axios.post('http://localhost:4001/events', event);
  
  // Pass the event to query service
  axios.post('http://localhost:4002/events', event);

  // Pass the event to moderation service
  axios.post('http://localhost:4003/events', event);

  res.send({ status: 'OK' });
});

// If any service is down for some time,
// then can request here to get all the events from the event data store
app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
    console.log('Listening on 4005');
  });
  