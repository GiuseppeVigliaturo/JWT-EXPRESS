const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = (req,res,next) => {
     //per accedere al cookie inviato dal client uso il pacchetto cookie parser
    const token = req.cookies.token;
    //utilizzo l'oggetto options sia per la firma che per la verifica del token 
    const options = {expiresIn: '100s', algorithm: 'RS256'};
    //per verificare il token ora che abbiamo utilizzato la chiave privata devo usare la chiave pubblica

    if (!token) return res.status(401).send('Nessun token fornito!');
    //Dato che stiamo lavorando con codice sincrono possiamo usare il blocco try catch
    try {
        const pub_key= fs.readFileSync('rsa.public');
        const payload = jwt.verify(token, pub_key,options);
        next();   
    } catch (error) {
        return res.status(401).send('il token non è valido oppure è scaduto')
    }
    // console.log(payload);
}