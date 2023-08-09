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
        if (req.session.user != undefined){
            res.render('index2', {user: req.session.user})
        } else {
            res.render('index', {user: req.session.user})
        }
    }catch(error){
        res.render('index', {user: req.session.user})
    }
});

app.get('/gotoranking', async function(req, res){
    let top_5 = await MySQL.realizarQuery(`Select * From Ranking;`)
    console.log(top_5)
    let puntos = [];
    let sorted = [];
    for (let i = 0; i<top_5.length; i++){
        puntos.push(top_5[i].points);
    }
    puntos.sort().reverse();
    for (let i = 0; i<puntos.length; i++){
        for (let e = 0; e<top_5.length; e++){
            if (puntos[i] == top_5[e].points){
                sorted.push({user:top_5[e].user, points: top_5[e].points});
                top_5.splice(e, 1);
            }
        }
    }
    sorted = sorted.slice(0,5);
    try{
        if (req.session.user != undefined){
            res.render('ranking2', {user: req.session.user, base: sorted})
        } else {
            res.render('ranking', {user: req.session.user, base: sorted})
        }
    }catch(error){
        res.render('ranking', {user: req.session.user, base: sorted})
    }
})

app.get('/gotoroulette', function(req, res){
    res.render('roulette', null)
});

app.get('/gotoindex', async function(req, res){         
    // let a = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user LIKE "Fulanito%";`);
    // let number = parseInt(a[a.length-1].user.slice(8)) + 1;
    // await MySQL.realizarQuery(`INSERT INTO UsersProyecto (name, surname, user, password) VALUES ("Fulanito${number}", "Fulanito${number}", "Fulanito${number}", "Fulanito${number}");`)
    if (req.session.user != undefined){
        res.render('index2', {user: req.session.user})
    } else {
        res.render('index', {user: req.session.user})
    }
});

app.get('/gotologin', function(req, res){
    res.render('login', null);
});

app.get('/login', function(req, res){
    if (req.session.user != undefined){
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
    req.session.destroy();
    res.render('index', null); 
});

app.get('/profile', async function(req,res){
    try{
        res.render('profile', {info: req.session.object[0]});
    }catch(error){
        res.render('index', null);
    }
});

app.get('/profileedit', async function(req,res){
    try{
        res.render('profileedit', {info: req.session.object[0]});
    }catch(error){
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
    data_base = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.body.user}";`); 
    if (data_base.length == 0){
        await MySQL.realizarQuery(`UPDATE UsersProyecto SET user = "${req.body.user}", name = "${req.body.name}", surname = "${req.body.surname}", description = "${req.body.description}" WHERE idUsers = "${req.body.id}";`);
        req.session.object = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.body.user}";`);
        req.session.user = req.session.object[0].user;
        res.send({validar: true});
    } else {
        if (req.session.user == req.body.user){
            await MySQL.realizarQuery(`UPDATE UsersProyecto SET surname = "${req.body.surname}", name = "${req.body.name}", description = "${req.body.description}" WHERE idUsers = "${req.body.id}";`);
            req.session.object = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.body.user}";`);
            req.session.user = req.session.object[0].user;
            res.send({validar: true});
        } else {
            await MySQL.realizarQuery(`UPDATE UsersProyecto SET surname = "${req.body.surname}", name = "${req.body.name}", description = "${req.body.description}" WHERE idUsers = "${req.body.id}";`);
            req.session.object = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.body.user}";`);
            req.session.user = req.session.object[0].user;
            res.send({validar: false});
        }
            
    }
})
app.put('/categoryreceive', async function(req, res){
    req.session.category = req.body.category;
    console.log("categoryreceive", req.session.category);
    res.send(null);
})
app.get('/gotogame', async function(req, res){
    // || req.session.score>=req.session.dataBase.length+1
    let largo;
    if(req.session.category==4 || req.session.category==undefined){
        req.session.category==1
    }
    if(req.session.dataBase==undefined){
        req.session.dataBase=await MySQL.realizarQuery(`SELECT * FROM Questions WHERE category=${req.session.category}`);
        dataBase=req.session.dataBase
    }
    let random=Math.floor(Math.random() * dataBase.length);
    let data1=dataBase[random];
    console.log("score' del gotogame session", req.session.score);
    if(dataBase.length==0){
        let dd=req.session.dataBase;
        req.session.dataBase=undefined;
        let right=req.session.score;
        let wrong=dd.length-right+1;
        console.log(typeof dd.length, dd.length+1);
        console.log(typeof right, right);
        console.log(typeof wrong, wrong);
        await MySQL.realizarQuery(`insert into Ranking values("${req.session.user}", ${req.session.score*100},${right},${wrong})`);
        req.session.score=0;
        console.log("req.session.score",req.session.score)
        res.render('index', {user:req.session.user})
    }
    else{
        res.render('game', {data: data1, count: req.session.score});
        dataBase.splice(random,1);
    }
});
let dataBase=[];
app.put('/randomQuestion', async function(req,res){
    if (req.session.score==undefined){
        req.session.score=0;
    }
    if (req.body.answer==1){
        req.session.score=req.session.score+1;
    }
    // console.log("randomQuestion", req.session.category);
    // console.log("postrandomQuestion",req.session.category);
    if(req.session.score==undefined ){
        req.session.score=0;
    }
    if(req.session.user==undefined || req.session.user==""){
        let a = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user LIKE "Fulanito%";`);
        let number = parseInt(a[a.length-1].user.slice(8)) + 1;
        await MySQL.realizarQuery(`INSERT INTO UsersProyecto (name, surname, user, password) VALUES ("Fulanito${number}", "Fulanito${number}", "Fulanito${number}", "Fulanito${number}");`)
        req.session.user="Fulanito"+ number;
        // console.log("user", "Fulanito"+ number);
        // console.log("req.user", req.session.user);
    }
    console.log("score del randomquestion despues de session", req.session.score);
    // res.send({question: req.session.question, score: req.session.score});
    res.send({score: req.session.score});
});
//algo para subir
//12.30