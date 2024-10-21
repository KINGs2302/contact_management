const express = require('express');
const { create, get, Updated, Delete } = require('../controllers/usercontrollers.js');

const routers = express.Router();

routers.post('/create', create);
routers.get('/get', get);
routers.put('/update/:id', Updated);
routers.delete('/delete/:id', Delete);

module.exports = routers;
