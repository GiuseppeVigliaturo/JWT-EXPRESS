const jwt = require('jsonwebtoken');
const fs = require('fs');

function verifyToken (req,res,next) {
     //per accedere al cookie inviato dal client uso il pacchetto cookie parser
    const token = req.cookies.token;
    //utilizzo l'oggetto options sia per la firma che per la verifica del token 
    const options = {expiresIn: '100s', algorithm: 'RS256'};
    //per verificare il token ora che abbiamo utilizzato la chiave privata devo usare la chiave pubblica

    if (!token) return res.status(401).send('Nessun token fornito!');
    //Dato che stiamo lavorando con codice sincrono possiamo usare il blocco try catch
    try {
        const pub_key= fs.readFileSync('rsa.public');
        //const payload = jwt.verify(token, pub_key,options);
        //rendo il payload disponibile alle middleware successive
        req.user = jwt.verify(token, pub_key,options);
        next();   
    } catch (error) {
        return res.status(401).send('il token non è valido oppure è scaduto')
    }
    // console.log(payload);
}

function deleteToken(req,res,next) {
    //per eliminare il cookie token dal client inviamo al client il cookie con scadenza nel passato
    const cookieSetting = {
        expires : new Date(0),
        httpOnly: true,
        secure: false //perchè siamo in sviluppo
    }
   res.cookie('token', '', cookieSetting).send('logout effettuato');
   next();
}

function signToken (req,res,next){
const payload = { id: 1, tipoUtente: 'premium', tema: 'dark'};
const options = {expiresIn: '100s', algorithm: 'RS256'};
const cookieSetting = {
    expires : new Date(Date.now() +100000),
    httpOnly: true,
    secure: false //perchè siamo in sviluppo
}
//vogliamo firmare il token non più con la chiave segreta ma con la chiave privata
const prv_key = fs.readFileSync('rsa.private')
const token= jwt.sign(payload, prv_key,options);
//memorizzo il token in un cookie
res.cookie('token', token,cookieSetting);
next();
}

    module.exports = {
        verifyToken,
        signToken,
        deleteToken
    }