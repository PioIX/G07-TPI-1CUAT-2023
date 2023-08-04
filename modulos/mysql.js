//Sección MySQL del código
const mySql = require("mysql2/promise");

/**
 * Objeto con la configuración de la base de datos MySQL a utilizar.
 */
const SQL_CONFIGURATION_DATA =
{
	// host: "10.1.5.205", //IP privada del servidor del colegio
	host: "186.18.137.196", //IP pública del servidor del colegio
	user: "2023_5INF_G07",
	password: "aSanLorenzolocorrimosenBoedo",
	database: "2023-5INF-G07",
	port: 3306,
	charset: 'UTF8_GENERAL_CI'
}

/**
 * Realiza una query a la base de datos MySQL indicada en el archivo "mysql.js".
 * @param {String} queryString Query que se desea realizar. Textual como se utilizaría en el MySQL Workbench.
 * @returns Respuesta de la base de datos. Suele ser un vector de objetos.
 */
exports.realizarQuery = async function (queryString)
{
	let returnObject;
	let connection;
	try
	{
		connection = await mySql.createConnection(SQL_CONFIGURATION_DATA);
		returnObject = await connection.execute(queryString); 
	}
	catch(err)
	{
		console.log(err);
	}
	finally
	{
		if(connection && connection.end) connection.end();
	}
	return returnObject[0];
}