const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Correct: import once
const authRouter = require('./routes/auth-routers.js'); 
const HomeRouter = require('./routes/home-router.js');
const PrintRouter = require('./routes/print-route.js');

const env = require('dotenv').config();
const models = require('./models/database.js');

const port = process.env.PORT || 8080;

// ✅ Middleware
app.use(bodyParser.json());

// ✅ CORS configuration
app.use(cors({
  origin: "https://smart-printt.netlify.app", // your Netlify frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Routes
app.use('/auth', authRouter); 
app.use('/home', HomeRouter);
app.use('/print', PrintRouter);

app.get('/', (req, res) => {
  res.send("Home hu mai");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Your Server is Running on ${port}`);
});
