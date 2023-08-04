
const express = require('express'); //Para el manejo del servidor Web
const exphbs  = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos
const session = require('express-session'); // Variables de Sesión
const req = require('express/lib/request');
const fileUpload = require('express-fileupload');
const app = express(); //Inicializo express para el manejo de las peticiones

app.use(fileUpload());
app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

app.use(session({secret: '123456', resave: true, saveUninitialized: true}));

const Listen_Port = 5000; //Puerto por el que estoy ejecutando la página Web

app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

app.get('/', function(req, res){
    res.render('index', {user: req.session.user});
});

app.get('/gotoindex', function(req, res){
    res.render('index', {user: req.session.user}); 
});

app.get('/gotologin', function(req, res){
    res.render('login', null);
});

app.get('/login', function(req, res){
    res.render('index', {user: req.session.user});
})

app.get('/gotoregister', function(req, res){
    res.render('register', {user: req.session.user}); 
});

app.get('/register', function(req, res){
    res.render('index', {user: req.session.user});
})

app.get('/gotogame', async function(req, res){
    
    if(req.session.dataBase==undefined){
        req.session.dataBase=await MySQL.realizarQuery(`SELECT * FROM Questions`);
        dataBase=req.session.dataBase
    }
    if(req.session.score==undefined ){
        req.session.score=0;
    }
    if(req.session.again==undefined){
        req.session.again=false;
    }
    // || req.session.score>=req.session.dataBase.length+1
    console.log("length", dataBase.length);
    let random=Math.floor(Math.random() * dataBase.length);
    let data1=dataBase[random];
    console.log("score' del gotogame session", req.session.score);
    if(dataBase.length==0){
        req.session.score=0;
        res.render('index', {user:req.session.user})
        dataBase=await MySQL.realizarQuery(`SELECT * FROM Questions`);
        console.log("req.session.score",req.session.score)
    }
    else{
        res.render('game', {data: data1, count: req.session.score}); 
        dataBase.splice(random,1);
    }
    
});

app.get('/gotoranking', function(req, res){
    res.render('ranking', {user: req.session.user}); 
});

app.get('/gotoadmin', function(req, res){
    res.render('admin', {user: req.session.user}); 
});

app.get('/gotousers', async function(req,res){
    let data_base = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto`)
    res.render('users', {users: data_base})
})

app.get('/gotoquestions', async function(req,res){
    let data_base = await MySQL.realizarQuery(`SELECT * FROM Questions`)
    res.render('questions', {users: data_base})
})

app.get('/questions', async function(req,res){
    let data_base = await MySQL.realizarQuery(`SELECT * FROM Questions`)
    res.render('questions', {users: data_base})
})

app.get('/logout', function(req,res){
    res.render('index', {user: req.session.user}); 
});

app.get('/gotoprofile', async function(req,res){
    let profile = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.session.user}";`);
    res.render('profile', {user: profile.user, name: profile.name, surname: profile.surname, description: profile.description});
});


app.put('/login', async function(req, res) {
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.body.user}" AND password = "${req.body.password}"; `);
    if (respuesta.length > 0) {
        if (req.body.user == "admin"){
            req.session.user = req.body.user;
            res.send({validar: true, admin:true});
        } else{
            req.session.user = req.body.user;
            res.send({validar: true, admin:false});
        }
    }else{
        res.send({validar:false, admin:false});   
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
        if (req.body.password != req.body.passwordConfirm){
            res.send({validar:false, mensaje:"Las contraseñas no coinciden"});
        } else {
            req.session.user = req.body.user;
            await MySQL.realizarQuery(`INSERT INTO UsersProyecto (name, surname, user, password) VALUES ("${req.body.name}", "${req.body.surname}", "${req.body.user}", "${req.body.password}");`)
            res.send({validar: true});
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

app.put('/randomQuestion', async function(req,res){
    if (req.session.score==undefined){
        req.session.score=0;
    }
    if (req.body.answer==1){
        req.session.score=req.session.score+1;
    }
    req.session.again=req.body.again;
    console.log("score del randomquestion despues de session", req.session.score);
    res.send({question: req.session.question, score: req.session.score});
});