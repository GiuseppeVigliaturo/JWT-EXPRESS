//generiamo una chiave segreta sicura col modulo nativo crypto
const crypto = require('crypto');

const secret = crypto.randomBytes(48).toString('base64').replace(/[\/=]/g);

//una volta generata la uso come chiave segreta
console.log(secret);