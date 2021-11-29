const debug=require('debug')('app:inicio');
//const dbDebug=require('debug')('app:db');
const express = require('express');
const config = require('config');
//const log = require('./logger');
const morgan=require('morgan');
const Joi = require('joi');
const app = express();


app.use(express.json());//Para que use las peticiones del body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
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

const usuarios =[
    {id:1, nombre:'James'},
    {id:2, nombre:'David'},
    {id:3, nombre:'Falcao'}
]

app.get('/', (req, res) => {
    res.send('Hola Mundo desde Express');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    //res.send(req.params);
    //res.send(req.query);
    //let usuario=usuarios.find(u=>u.id===parseInt(req.params.id));
    let usuario=existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {

   
    const {error, value}=validarUsuario(req.body.nombre);
    if(!error){
        const usuario={
        id:usuarios.length+1,
        nombre:value.nombre
        }; 
        usuarios.push(usuario); 
        res.send(usuario);
    }else{
        const mensaje=error.details[0].message;
        res.status(400).send(mensaje); 
    }

});


app.put('/api/usuarios/:id', (req, res)=>{
    //Encontrar si existe el objeto usuario
    //let usuario=usuarios.find(u=>u.id===parseInt(req.params.id));
    let usuario=existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    const {error, value}=validarUsuario(req.body.nombre);

    if(error){
        const mensaje=error.details[0].message;
        res.status(400).send(mensaje); 
        return;
    }
    usuario.nombre=value.nombre;
    res.send(usuario);
    



});

app.delete('/api/usuarios/:id',(req, res)=>{
    let usuario=existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 

    const index= usuarios.indexOf(usuario);
    usuarios.splice(index,1);
    res.send(usuarios);
});



const port= process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Escuchando en el puerto ${port}...`);
})


function existeUsuario(id){
    return(usuarios.find(u=>u.id===parseInt(id)));
}
function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: nom }));
}

