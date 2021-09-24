const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const checkAuth = require('./middleware/user-auth')
require('dotenv').config();

const app = express();
app.use(cookieParser());



//creazione token con rotta post per mimare l'invio di un form
app.get('/login',(req,res)=>{
    const payload = { id: 1, isLogged: true}
    
    const cookieSetting = {
        expires : new Date(Date.now() +100000),
        httpOnly: true,
        secure: false //perchè siamo in sviluppo
    }
    //vogliamo firmare il token non più con la chiave segreta ma con la chiave privata
    const prv_key = fs.readFileSync('rsa.private')
    const token= jwt.sign(payload, prv_key,options);
    //memorizzo il token in un cookie
    res.cookie('token', token,cookieSetting).send();
})

//se dopo aver fatto richiesta alla rotta login vado in questa rotta troverò il token
// il client cioè ci sta inviando il token 
app.get('/user/profile',checkAuth,(req,res)=>{
   res.send('sei autenticato!');
})

app.get('/user/message',checkAuth,(req,res)=>{
   res.send('sei autenticato!');
})

app.get('/logout',(req,res)=>{
   //per eliminare il cookie token dal client inviamo al client il cookie con scadenza nel passato
    const cookieSetting = {
        expires : new Date(0),
        httpOnly: true,
        secure: false //perchè siamo in sviluppo
    }
   res.cookie('token', '', cookieSetting).send('logout effettuato');
})

app.listen(3000, ()=> console.log('Server in ascolto sulla porta 3000'));