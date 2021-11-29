const debug=require('debug')('app:inicio');
//const dbDebug=require('debug')('app:db');
const usuarios=require('./routes/usuarios');
const express = require('express');
const config = require('config');
//const log = require('./logger');
const morgan=require('morgan');

const app = express();


app.use(express.json());//Para que use las peticiones del body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios/',usuarios);
//Configuración de entornos

console.log('Aplicación: '+ config.get('nombre'));
console.log('BD server: '+config.get('configDB.host'));


//Uso de middleware de tercero- Morgan
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    // console.log('Morgan habilitado...')
    debug('Morgan está habilitado.');
}
//Trabajos con la base de datos 
debug('Conectando con la base datos...');


//app.use(log);
// app.use(function(req, res, next) {
//     console.log('Autenticado...')
//     next();
// });



app.get('/', (req, res) => {
    //res.send('Hola Mundo desde Express');
    res.send('Hola amor, te amo');

});

const port= process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Escuchando en el puerto ${port}...`);
})




