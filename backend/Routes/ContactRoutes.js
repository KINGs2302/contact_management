const express = require('express');
const { create,creat, get, Updated, Delete } = require('../controllers/usercontrollers.js');

const routers = express.Router();

routers.post('/create', create);
routers.post('/creat', creat);
routers.get('/get', get);
routers.put('/update/:id', Updated);
routers.delete('/delete/:id', Delete);

module.exports = routers;
