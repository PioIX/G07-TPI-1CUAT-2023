const express = require('express'); 
const exphbs  = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const MySQL = require('./modulos/mysql'); 
const session = require('express-session'); 
const req = require('express/lib/request');
const fs = require('fs');
const mod_path = require('path');

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

var image_number = 0;

app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

app.get('/', function(req, res){
    fs.unlink("./public/uploads/BIANCHI 5.jpg", function (err){
        if (!err){
            console.log("Deleted file!")
        }
    });
    try{
        if (req.session.user != undefined){
            if (req.session.object[0].avatar==null){
                res.render('index2', {user: req.session.user, img:"user.png"})
            }
            res.render('index2', {user: req.session.user, img: req.session.object[0].avatar})
        } else {
            res.render('index', {user: req.session.user})
        }
    }catch(error){
        res.render('index', {user: req.session.user})
    }
});

app.get('/gotoranking', async function(req, res){
    let top_5 = await MySQL.realizarQuery(`Select * From Ranking ORDER BY points DESC;`)
    try{
        if (req.session.user != undefined){
            if (req.session.object[0].avatar==null){
                res.render('ranking2', {user: req.session.user, base: top_5.slice(0,5), img:"user.png"})
            }
            res.render('ranking2', {user: req.session.user, base: top_5.slice(0,5), img: req.session.object[0].avatar})
        } else {
            res.render('ranking', {user: req.session.user, base: top_5.slice(0,5)})
        }
    }catch(error){
        res.render('ranking', {user: req.session.user, base: top_5.slice(0,5)})
    }
})

app.get('/gotoroulette', function(req, res){
    res.render('roulette', null)
});

app.get('/gotoindex', async function(req, res){         
    if (req.session.user != undefined){
        if (req.session.object[0].avatar==null){
            res.render('index2', {user: req.session.user, img:"user.png"})
        }
        res.render('index2', {user: req.session.user, img:req.session.object[0].avatar})
    } else {
        res.render('index', {user: req.session.user})
    }
});

app.get('/gotologin', function(req, res){
    res.render('login', null);
});

app.get('/login', function(req, res){
    try{
        if (req.session.user != undefined){
            if (req.session.object[0].avatar==null){
                res.render('index2', {user: req.session.user, img:"user.png"})
            }
            res.render('index2', {user: req.session.user, img: req.session.object[0].avatar})
        } else {
            res.render('index', {user: req.session.user})
        }
    }catch(error){
        res.render('index', {user: req.session.user})
    }
})

app.get('/gotoregister', function(req, res){
    res.render('register', null); 
});

app.get('/register', function(req, res){
    try{
        if (req.session.user != undefined){
            if (req.session.object[0].avatar==null){
                res.render('index2', {user: req.session.user, img:"user.png"})
            }
            res.render('index2', {user: req.session.user, img: req.session.object[0].avatar})
        } else {
            res.render('index', {user: req.session.user})
        }
    }catch(error){
        res.render('index', {user: req.session.user})
    }
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
        if (req.session.user != undefined){
            if (req.session.object[0].avatar==null){
                res.render('profile', {user: req.session.user, img:"user.png"})
            }
            res.render('profile', {user: req.session.user, img: req.session.object[0].avatar, info: req.session.object[0]})
        } else {
            res.render('index', {user: req.session.user})
        }
    }catch(error){
        res.render('index', {user: req.session.user})
    }
});

app.get('/profileedit', async function(req,res){
    try{
        if (req.session.user != undefined){
            if (req.session.object[0].avatar==null){
                res.render('profileedit', {user: req.session.user, img:"user.png"})
            }
            res.render('profileedit', {user: req.session.user, img: req.session.object[0].avatar, info: req.session.object[0]})
        } else {
            res.render('index', {user: req.session.user})
        }
    }catch(error){
        res.render('index', {user: req.session.user})
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
                await MySQL.realizarQuery(`INSERT INTO UsersProyecto (name, surname, user, password) VALUES ("${req.body.name}", "${req.body.surname}", "${req.body.user}", "${req.body.password}");`)
                req.session.object = await MySQL.realizarQuery(`Select * From UsersProyecto Where user = "${req.body.user}"`)
                req.session.user = req.body.user;
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

app.post('/profilemodify', async function(req,res) {
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
    console.log(req.session.category);
    res.send(null);
})

app.get('/gotogame', async function(req, res){
    console.log(req.session.category);
    if(req.session.category==4){
        req.session.category==1
    }
    if(req.session.dataBase==undefined){
        req.session.dataBase=await MySQL.realizarQuery(`SELECT * FROM Questions WHERE category=${req.session.category}`);
        dataBase=req.session.dataBase
    }
    if(req.session.score==undefined ){
        req.session.score=0;
    }
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

app.post('/upload2', async function (req,res){
    console.log(req.files)
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



app.post('/upload', async function (req,res){
    if (req.files){
        let f_upload = req.files.f_upload;
        f_upload.name = "image" + image_number + "." + f_upload.mimetype.slice(6,f_upload.mimetype.length);
        image_number = image_number + 1;
    
        const ext = mod_path.extname(f_upload.name);
        const ext_allowed = ['.png', '.jpg', '.jpeg'];
    
        if (!ext_allowed.includes(ext)){
            mensaje = "El archivo " + f_upload.name + " es un archivo no permitido";
        }

        let url = './public/uploads/' + f_upload.name;
    
        f_upload.mv(url,async function(err){
            if (err){
                mensaje = "Ocurrio un error al subir el archivo: " + err 
            }
            let img_name = await MySQL.realizarQuery(`Select avatar From UsersProyecto Where user = "${req.session.user}"`)
            await MySQL.realizarQuery(`UPDATE UsersProyecto SET avatar = "${f_upload.name}"WHERE user = "${req.session.user}";`);
            req.session.object = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.session.user}";`);
            res.render('profile', {info: req.session.object[0], img: req.session.object[0].avatar});
        })
    } else {
        res.render('profile', {info: req.session.object[0], img: req.session.object[0].avatar});
    }
});