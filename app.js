var express = 	require("express"),
	app		= 	express()
	puerto 	= 	8081, 
	bodyParser 	= require('body-parser');

//Para indicar que se envía y recibe información por medio de Json...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Datos de Usuario...
var usuario = [
				{
					id 			: 	1, 
					identifi	: 	"12345",
					nombre 		: 	"Alexandra", 
					apellido	: 	"Rodriguez", 
					email		: 	"alexa@correo.com",
					foto		: 	"none"
				},
				{
					id 			: 	2, 
					identifi	: 	"107256",
					nombre 		: 	"Alejandro", 
					apellido	: 	"Garcia",
					email		: 	"alejo@correo.com",  
					foto		: 	"none"
				},
				{
					id 			: 	3, 
					identifi	: 	"893434",
					nombre 		: 	"Camilo", 
					apellido	: 	"Rodriguez", 
					email		: 	"kmilo@correo.com",
					foto		: 	"none"
				}];

//datos de los mensajes
var mensajes = [
				{
					id 			: 	1, 
					nombre		: 	"Alexandra",
					mensaje 	: 	"Hola mundo!!!!",
					fecha		:  "22-mayo-2015",
					hora		:  "10:00am"
						},
				{
					id 			: 	2, 
					nombre		: 	"Alejo",
					mensaje 	: 	"como estas , sigues viviendo en chia?",
					fecha		:  "24-mayo-2015",
					hora		:  "11:00 am"
				},
				{
					id 			: 	3, 
					nombre		: 	"kmilo",
					mensaje 	: 	"no esperaba encontrarte de nuevo",
					fecha		:  "21-mayo-2015",
					hora		:  "1:00 pm"
				}];

//servicios resst para los mensajes
app.get('/getAllMensajes', function(req, res)
{
	res.json(mensajes);   
});
app.post('/createMensaje', function (req, res)
{
	res.json(crearMensaje(req.body));
});

var crearMensaje = function(data){

	mensajes.push(data);
	mensajes[mensajes.length - 1].id = mensajes.length;
	return {Estado : "Ha Creado su Mensaje"};
}
//Servicios REST para los usuarios...
app.get('/getAllData', function(req, res)
{
	res.json(usuario);   
});

app.post('/createData', function (req, res)
{
	res.json(crearEditarUsuario(req.body, 1));
});

app.put('/updateData', function (req, res)
{
	res.json(crearEditarUsuario(req.body, 2));
});

app.delete('/deleteData/:id', function(req, res)
{
	var ind = buscarIDUser(req.param("id"));
	if(ind >= 0)
	{
		usuario.splice(ind, 1);
	}
	res.json({status : ind >= 0 ? true : false});
});

app.get('/getData/:id', function(req, res)
{
	var ind = buscarIDUser(req.param("id"));
	var devuelve = {datos : ind >= 0 ? usuario[ind] : "", status : ind >= 0 ? true : false};
	res.json(devuelve);
});

//Para cualquier url que no cumpla la condición...
app.get("*", function(req, res)
{
	res.status(404).send("Página no encontrada :( en el momento");
});

//Crear o edita un usuario...
var crearEditarUsuario = function(data, tipo)
{
	var idedita = tipo === 1 ? 0 : data.id;
	var existe = userExiste(data.identifi, data.email, idedita);
	if(!existe)
	{
		if(tipo === 1)
		{
			usuario.push(data);
			usuario[usuario.length - 1].id = usuario.length;
			idedita = usuario[usuario.length - 1].id;
		}
		else
		{
			usuario[buscarIDUser(idedita)] = data;
		}
	}
	return {id : !existe ? idedita : 0, status : !existe};
}

//Busca la posición del usuario en el array...
var buscarIDUser = function(id)
{
	var ind = -1;
	for(var i = 0; i < usuario.length; i++)
	{
		if(Number(usuario[i].id) === Number(id))
		{
			ind = i;
			break;
		}
	}
	return ind;
};

//Para saber si un usuario ya existe...
var userExiste = function(identifica, email, ind)
{
	var existe = false;
	for(var i = 0; i < usuario.length; i++)
	{
		if(identifica === usuario[i].identifi || email.toLowerCase() === usuario[i].email.toLowerCase())
		{
			if(Number(usuario[i].id) !== Number(ind))
			{
				existe = true;
				break;
			}
		}
	}
	return existe;
};

app.listen(puerto);
console.log("Express server iniciado en el " + puerto);