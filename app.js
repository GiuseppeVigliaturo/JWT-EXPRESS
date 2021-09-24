const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {verifyToken,signToken,deleteToken} = require('./middleware/user-auth')
require('dotenv').config();

const app = express();
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(cookieParser());



//creazione token con rotta post per mimare l'invio di un form
app.get('/login',signToken,(req,res)=>{
    res.send();
})

//se dopo aver fatto richiesta alla rotta login vado in questa rotta troverò il token
// il client cioè ci sta inviando il token 
app.get('/user/profile',verifyToken,(req,res)=>{
    console.log(req.user.tema);
    const tema = req.user.tema;
   res.render('profile', {tema});
})

app.get('/user/message',verifyToken,(req,res)=>{
   res.send('sei autenticato!');
})

app.get('/logout',deleteToken,(req,res)=>{
   res.send('logout effettuato')
})

app.listen(3000, ()=> console.log('Server in ascolto sulla porta 3000'));