const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const apiRoutes = require('./routes/apiroutes');
app.use('/api', apiRoutes);
app.use(express.static('views'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
