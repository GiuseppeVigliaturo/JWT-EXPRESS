const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

//creazione token con rotta post per mimare l'invio di un form
app.post('/login',(req,res)=>{
    const payload = { id: 1, isLogged: true}
    options = {expiresIn: '10s'};
    const token= jwt.sign(payload, process.env.JWT_KEY,options);
    res.send(token);
})

app.listen(3000, ()=> console.log('Server in ascolto sulla porta 3000'));