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

app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

app.get('/', function(req, res){
    if (req.session.user != undefined && req.session.user.includes("Fulanito") == false){
        if (req.session.object[0].avatar==null){
            res.render('index2', {user: req.session.user, img:"user.png"})
        }
        res.render('index2', {user: req.session.user, img: req.session.object[0].avatar})
    } else {
        res.render('index', {user: req.session.user})
    }
});

app.get('/gotoranking', async function(req, res){
    let top_5 = await MySQL.realizarQuery(`Select * From Ranking ORDER BY points DESC;`)
    if (req.session.user != undefined && req.session.user.includes("Fulanito") == false){
        if (req.session.object[0].avatar==null){
            res.render('ranking2', {user: req.session.user, base: top_5.slice(0,5), img:"user.png"})
        }
        res.render('ranking2', {user: req.session.user, base: top_5.slice(0,5), img: req.session.object[0].avatar})
    } else {
        res.render('ranking', {user: req.session.user, base: top_5.slice(0,5)})
    }
})

app.get('/gotoroulette', function(req, res){
    res.render('roulette', null)
});

app.get('/gotoindex', async function(req, res){ 
    if (req.session.user != undefined && req.session.user.includes("Fulanito") == false){
        if (req.session.object[0].avatar==null){
            res.render('index2', {user: req.session.user, img:"user.png"})
        } else {
            res.render('index2', {user: req.session.user, img:req.session.object[0].avatar})
        }
    } else {
        res.render('index', {user: req.session.user})
    }
});

app.get('/gotologin', function(req, res){
    res.render('login', null);
});

app.get('/login', function(req, res){
    if (req.session.user != undefined && req.session.user.includes("Fulanito") == false){
        if (req.session.object[0].avatar==null){
            res.render('index2', {user: req.session.user, img:"user.png"})
        } else {
            res.render('index2', {user: req.session.user, img:req.session.object[0].avatar})
        }
    } else {
        res.render('index', {user: req.session.user})
    }
})

app.get('/gotoregister', function(req, res){
    res.render('register', null); 
});

app.get('/hola', function(req, res){
    res.render('hola', {hola:"3"});
})

app.get('/register', function(req, res){
    if (req.session.user != undefined && req.session.user.includes("Fulanito") == false){
        if (req.session.object[0].avatar==null){
            res.render('index2', {user: req.session.user, img:"user.png"})
        } else {
            res.render('index2', {user: req.session.user, img:req.session.object[0].avatar})
        }
    } else {
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
    if (req.session.user != undefined && req.session.user.includes("Fulanito") == false){
        if (req.session.object[0].avatar==null){
            res.render('profile', {user: req.session.user, img:"user.png", info: req.session.object[0]})
        } else {
            res.render('profile', {user: req.session.user, img: req.session.object[0].avatar, info: req.session.object[0]})
        }
    } else {
        res.render('index', {user: req.session.user, img:"user.png"})
    }
});

app.get('/profileedit', async function(req,res){
    if (req.session.user != undefined && req.session.user.includes("Fulanito") == false){
        if (req.session.object[0].avatar==null){
            res.render('profileedit', {user: req.session.user, img:"user.png", info: req.session.object[0]})
        } else {
            res.render('profileedit', {user: req.session.user, img: req.session.object[0].avatar, info: req.session.object[0]})
        }
    } else {
        res.render('index', {user: req.session.user, img:"user.png"})
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
                if (req.session.fulanito != undefined){
                    await MySQL.realizarQuery(`UPDATE UsersProyecto SET name = "${req.body.name}", surname = "${req.body.surname}", user = "${req.body.user}", password = "${req.body.password}" WHERE user = "${req.session.user}";`)
                    await MySQL.realizarQuery(`UPDATE Ranking SET user = "${req.body.user}" WHERE user = "${req.session.user}";`)
                    res.send({validar: true});
                } else {
                    await MySQL.realizarQuery(`INSERT INTO UsersProyecto (name, surname, user, password) VALUES ("${req.body.name}", "${req.body.surname}", "${req.body.user}", "${req.body.password}");`)
                    await MySQL.realizarQuery(`INSERT INTO Ranking (user, points, correct_answers, wrong_answers, games_played) VALUES ("${req.body.user}", 0, 0, 0, 0);`)
                    req.session.object = await MySQL.realizarQuery(`Select * From UsersProyecto Where user = "${req.body.user}"`)
                    req.session.user = req.body.user;
                    res.send({validar: true});
                }
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

app.get('/prueba', function(req, res) {
    res.render('prueba', null)
})

app.put('/questionmodify', async function(req, res) {
    await MySQL.realizarQuery(`UPDATE Questions SET question = "${req.body.question}", answer_1 = "${req.body.answer_1}", answer_2 = "${req.body.answer_2}", answer_correct = "${req.body.answer_correct}" WHERE idQuestion = "${req.body.idQuestion}";`)
    res.send({validar: true});
});

app.put('/categoryreceive', async function(req, res){
    req.session.category = req.body.category;
    res.send(null);
})

app.get('/gotogame', async function(req, res){
    if (req.session.score == undefined){
        req.session.score = 0;
        req.session.corrects = 0;
        req.session.incorrects = 0;
    }
    if (req.session.dataBase == undefined){
        req.session.dataBase = await MySQL.realizarQuery(`SELECT * FROM Questions WHERE category = "${req.session.category}"`);
        req.session.dataBase = req.session.dataBase.sort(function() { return Math.random() - 0.5 });
        req.session.dataBase = req.session.dataBase.slice(0,4);
    }
    let random = Math.floor(Math.random() * req.session.dataBase.length);
    let set = req.session.dataBase[random];
    if (set != undefined){
        var valores = Object.values(set);
        valores.splice(0,1)
        valores.splice(0,1)
        valores.splice(3,1)
        valores.sort(function() { return Math.random() - 0.5 });
    }
    if (req.session.dataBase.length==0){
        if (req.session.user == undefined){
            let a = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user LIKE "Fulanito%";`);
            let number = parseInt(a[a.length-1].user.slice(8)) + 1;
            await MySQL.realizarQuery(`INSERT INTO UsersProyecto (name, surname, user, password) VALUES ("Fulanito${number}", "Fulanito${number}", "Fulanito${number}", "Fulanito${number}");`)
            await MySQL.realizarQuery(`INSERT INTO Ranking (user, points, correct_answers, wrong_answers, games_played) VALUES ("Fulanito${number}", ${req.session.score*100}, ${req.session.corrects}, ${req.session.incorrects}, 1);`)
            let b = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "Fulanito${number}";`);
            req.session.user = `Fulanito${number}`;
            req.session.object = b;
            req.session.fulanito = true;
        } else {
            let object = await MySQL.realizarQuery(`Select * From Ranking WHERE user = "${req.session.user}"`);
            await MySQL.realizarQuery(`UPDATE Ranking SET points = ${object[0].points + req.session.score*100}, correct_answers = ${object[0].correct_answers + req.session.corrects}, wrong_answers = ${object[0].wrong_answers + req.session.incorrects}, games_played = ${object[0].games_played + 1}  WHERE user = "${req.session.user}";`)
        }
        req.session.score = 0;
        req.session.corrects = 0;
        req.session.incorrects = 0;
        req.session.dataBase = undefined;
        setTimeout(() => {
            if (req.session.user != undefined && req.session.user.includes("Fulanito") == false){
                if (req.session.object[0].avatar==null){
                    res.render('index2', {user: req.session.user, img:"user.png"});
                }
                res.render('index2', {user: req.session.user, img: req.session.object[0].avatar})
            } else {
                res.render('index', {user: req.session.user})
            }
        }, 1000);
    }
    else{
        req.session.dataBase.splice(random,1);
        res.render('game', {question: set.question, count: req.session.score, right_answer: set.answer_correct, answer_1: valores[0], answer_2: valores[1], answer_3: valores[2]}); 
    }
});

app.put('/randomQuestion', async function(req,res){
    if (req.body.right==1){
        req.session.corrects = req.session.corrects + 1;
        req.session.score = req.session.score + 1;
    } else {
        req.session.incorrects = req.session.incorrects + 1;
    }
    res.send(null);
});

app.post('/profilemodify', async function (req,res){
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
        
        let numberArray = await MySQL.realizarQuery(`Select avatar From UsersProyecto WHERE avatar IS NOT NULL;`);
        let sorted = [];
        for (let i = 0; i<numberArray.length; i++){
            let number = numberArray[i].avatar.slice(5,numberArray[i].avatar.length);
            if (numberArray[i].avatar.includes(".jpeg")){
                number = number.slice(0, number.length-5)
            } else {
                number = number.slice(0, number.length-4)
            }
            sorted.push(parseInt(number));
        }
        let numberImage = parseInt(Math.max(...sorted)) + 1
        if (sorted.length == 0){
            numberImage = 0
        }
        let f_upload = req.files.f_upload;

        f_upload.name = "image" + numberImage + "." + f_upload.mimetype.slice(6,f_upload.mimetype.length);
    
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
            if (img_name != null){
                fs.unlink("./public/uploads/"+img_name[0].avatar, function(err){
                    if (!err){
                        console.log("Deleted File!")
                    }
                });
            }
            await MySQL.realizarQuery(`UPDATE UsersProyecto SET avatar = "${f_upload.name}"WHERE user = "${req.session.user}";`);
            req.session.object = await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user = "${req.session.user}";`);
            res.render('profile', {info: req.session.object[0], img: req.session.object[0].avatar});
        })
    } else {
        res.render('profile', {info: req.session.object[0], img: req.session.object[0].avatar, user: req.session.user});
    }
});