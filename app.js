const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cookieParser());

//utilizzo l'oggetto options sia per la firma che per la verifica del token 
const options = {expiresIn: '100s', algorithm: 'RS256'};

//creazione token con rotta post per mimare l'invio di un form
app.get('/login',(req,res)=>{
    const payload = { id: 1, isLogged: true}
    
    const cookieSetting = {
        expires : new Date(Date.now() +100000),
        httpOnly: true,
        secure: false
    }
    //vogliamo firmare il token non più con la chiave segreta ma con la chiave privata
    const prv_key = fs.readFileSync('rsa.private')
    const token= jwt.sign(payload, prv_key,options);
    //memorizzo il token in un cookie
    res.cookie('token', token,cookieSetting).send();
})

//se dopo aver fatto richiesta alla rotta login vado in questa rotta troverò il token
// il client cioè ci sta inviando il token 
app.get('/user/profile',(req,res)=>{
    //per accedere al cookie inviato dal client uso il pacchetto cookie parser
    const token = req.cookies.token;
    //per verificare il token ora che abbiamo utilizzato la chiave privata devo usare la chiave pubblica

    if (!token) {
        
        return res.status(401).send('Nessun token fornito!');
    }
    //Dato che stiamo lavorando con codice sincrono possiamo usare il blocco try catch
    try {
        const pub_key= fs.readFileSync('rsa.public');
        const payload = jwt.verify(token, pub_key,options);   
    } catch (error) {
        return res.status(401).send('il token non è valido oppure è scaduto')
    }
    // console.log(payload);
    res.send('Il token è valido');
})

app.listen(3000, ()=> console.log('Server in ascolto sulla porta 3000'));