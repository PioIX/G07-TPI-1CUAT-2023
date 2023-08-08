if (req.session.user == undefined){
    await MySQL.realizarQuery(`SELECT * FROM UsersProyecto WHERE user LIKE "Fulanito%"`);

}