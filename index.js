const express = require('express'); 
const exphbs  = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const MySQL = require('./modulos/mysql'); 
const session = require('express-session'); 
const req = require('express/lib/request');
const fileUpload = require('express-fileupload');
const app = express(); 

app.use(fileUpload());
app.use(express.static('public')); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); 
app.set('view engine', 'handlebars'); 

app.use(session({secret: '123456', resave: true, saveUninitialized: true}));

const Listen_Port = 5000; 

function uploadFile(req, carpeta, isImage, callback){
    if (!req.files){
        callback(-1);
    } else {
        let file = req.files.uploaded_image;
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || isImage == false){
            file.mv(carpeta + file.name, function(err){
                if (err){
                    callback(-2);
                } else {
                    callback(file.name);
                }
            });
        } else {
            callback(0);
        }
    }
}



app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

app.get('/', function(req, res){
    try{
        if (req.session.user != ""){
            res.render('index2', {user: req.session.user})
        } else {
            res.render('index', {user: req.session.user})
        }
    }catch(error){
        res.render('index', {user: req.session.user})
    }
});

app.get('/gotoranking', function(req, res){
    res.render('ranking', null);
})

app.get('/gotoroulette', function(req, res){
    res.render('roulette', null)
});

app.get('/gotoindex', function(req, res){   
    if (req.session.user != ""){
        res.render('index2', {user: req.session.user})
    } else {
        res.render('index', {user: req.session.user})
    }
});

app.get('/gotologin', function(req, res){
    res.render('login', null);
});

app.get('/login', function(req, res){
    if (req.session.user != ""){
        res.render('index2', {user: req.session.user})
    } else {
        res.render('index', {user: req.session.user})
    }
})

app.get('/gotoregister', function(req, res){
    res.render('register', null); 
});

app.get('/register', function(req, res){
    res.render('index', {user: req.session.user});
})

app.get('/gotogame', function(req, res){
    res.render('game', null); 
});

app.get('/gotoadmin', function(req, res){
    if (req.session.user != "admin"){
        res.render('index', null);
    } else {
        res.render('admin', null);
    }
});

app.get('/gotousers', async function(req,res){
    if (req.session.user != "admin"){
        res.render('index', null);
    } else {
        let data_base = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto`);
        res.render('users', {users: data_base})
    }
})

app.get('/gotoquestions', async function(req,res){
    if (req.session.user != "admin"){
        res.render('index', null);
    } else {
        let data_base = await MySQL.realizarQuery(`SELECT * FROM Questions`)
        res.render('questions', {users: data_base})
    }
})

app.get('/questions', async function(req,res){
    let data_base = await MySQL.realizarQuery(`SELECT * FROM Questions`)
    res.render('questions', {users: data_base})
})

app.get('/logout', function(req,res){
    req.session.user =  "";
    res.render('index', null); 
});

app.get('/profile', async function(req,res){
    try{
        res.render('profile', {info: req.session.object[0]});
    }catch(error){
        console.log("Debe loguearse");
        res.render('index', null);
    }
});

app.put('/login', async function(req, res) {
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.body.user}" AND password = "${req.body.password}"; `);
    if (respuesta.length > 0) {
        if (req.body.user == "admin"){
            req.session.user = respuesta[0].user;
            req.session.object = respuesta;
            res.send({validar: true, admin: true});
        } else{
            req.session.user = respuesta[0].user;
            req.session.object = respuesta;
            res.send({validar: true, admin:false});
        }
    }else{
        if (req.body.user == "" || req.body.password == ""){
            res.send({validar:false, admin:false, msg:"Rellenar toda la Información "});   
        } else {
            res.send({validar:false, admin:false, msg:"Datos Incorrectos"});   
        }
    }
});

app.put('/register', async function(req, res) {
    let cont = 0;
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto;`);
    for (let i = 0; i<respuesta.length; i++){
        if (req.body.user == respuesta[i].user){
            cont ++;
        }
    }
    if (cont <= 0) {
        if (req.body.user == "" || req.body.password == "" || req.body.name == "" || req.body.surname == "" || req.body.passwordConfirm == ""){
            res.send({validar:false, mensaje    :"Rellenar toda la Información"});
        } else {
            if (req.body.password != req.body.passwordConfirm){
                res.send({validar:false, mensaje:"Las contraseñas no coinciden"});
            } else {
                req.session.user = req.body.user;
                req.session.object = respuesta;
                await MySQL.realizarQuery(`INSERT INTO UsersProyecto (name, surname, user, password) VALUES ("${req.body.name}", "${req.body.surname}", "${req.body.user}", "${req.body.password}");`)
                res.send({validar: true});
            }
        }
        
    } else{
        res.send({validar:false, mensaje:"El usuario ya existe"});   
    }
});


app.put('/userremove', async function(req, res) {
    await MySQL.realizarQuery(`DELETE FROM UsersProyecto WHERE idUsers = "${req.body.idUser}" `);
    res.send({validar: true});
});

app.put('/questionadd', async function(req, res) {
    await MySQL.realizarQuery(`INSERT INTO Questions (question, answer_1, answer_2, answer_correct) VALUES ("${req.body.question}", "${req.body.answer_1}", "${req.body.answer_2}", "${req.body.answer_correct}");`);
    res.send({validar: true});
});

app.put('/questionremove', async function(req, res) {
    await MySQL.realizarQuery(`DELETE FROM Questions WHERE idQuestion = "${req.body.idQuestion}"`);
    res.send({validar: true});
});

app.put('/questionmodify', async function(req, res) {
    await MySQL.realizarQuery(`UPDATE Questions SET question = "${req.body.question}", answer_1 = "${req.body.answer_1}", answer_2 = "${req.body.answer_2}", answer_correct = "${req.body.answer_correct}" WHERE idQuestion = "${req.body.idQuestion}";`)
    res.send({validar: true});
});

app.put('/profilemodify', async function(req,res) {
    data_base = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = ${req.body.user};`); 
    if (data_base.length == 0){
        MySQL.realizarQuery(`UPDATE UsersProyecto SET user = "${req.body.user}", name = "${req.body.name}", surname = "${req.body.surname}" WHERE idUsers = "${req.body.id}";`); 
        res.send({validar: true});
    } else {
        MySQL.realizarQuery(`UPDATE UsersProyecto SET surname = "${req.body.surname}", name = "${req.body.name}" WHERE idUsers = "${req.body.id}";`);
        res.send({validar: false});
    }
})

app.put('/categoryreceive', async function(req, res){
    req.session.category = req.body.category;
    res.send(null);
})