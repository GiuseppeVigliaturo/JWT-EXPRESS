const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cookieParser());

//creazione token con rotta post per mimare l'invio di un form
app.get('/login',(req,res)=>{
    const payload = { id: 1, isLogged: true}
    options = {expiresIn: '10s'};
    const token= jwt.sign(payload, process.env.JWT_KEY,options);
    //memorizzo il token in un cookie
    res.cookie('token', token).send();
})

//se dopo aver fatto richiesta alla rotta login vado in questa rotta troverò il token
// il client cioè ci sta inviando il token 
app.get('/user/profile',(req,res)=>{
    //per accedere al cookie inviato dal client uso il pacchetto cookie parser
    console.log(req.cookies.token);
    res.send();
})

app.listen(3000, ()=> console.log('Server in ascolto sulla porta 3000'));