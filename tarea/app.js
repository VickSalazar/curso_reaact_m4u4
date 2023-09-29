var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var loginRouter = require('./routes/admin/login'); // Llama al js login.js


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ukrjeLm4ketsre0lW2cx', // mínimo 20 y que sea difícil de generar
  resave: false,
  saveUninitialized: true
}));


app.get('/', function (req, res) {

  res.render('index', {
    title: 'Ingreso de Usuario',
    exito: req.session.exito,
    nombre: req.session.nombre,
    edad: req.session.edad,
    msgError: req.session.msgError
  })

});

app.post('/ingresar', function (req, res) {

  var msgError = '';

  // Valido nombre
  var hayNombre = Boolean(req.body.nombre);
  // Nombre obligatorio
  if (!hayNombre) {
    msgError += ' Debe completar el nombre.';
  } // Podría poner else y validar longitud de campo, caracteres permitidos, etc


  // Valido edad
  var hayEdad = Boolean(req.body.edad);
  
  if (hayEdad) {
    var edad = req.body.edad;
    // Edad debe ser un número entero
    if (isNaN(edad)) {
      msgError += ' Edad debe ser un número entero entre 1 y 100.';
    } else {
      var intEdad = parseInt(edad);
      // Edad debe ser un número entero entre rango
      if (intEdad < 1 && intEdad < 100) {
        msgError += ' Edad debe ser un número entero entre 1 y 100.';       
      } else if (intEdad < 18) { // Edad mayor o igual a 18 
        msgError += ' Edad debe ser mayor o igual a 18, menores no están autorizados. ';
      }
    }
  } else {// Edad Obligatoria
    msgError += ' Debe completar la edad.';
  }
  
  // Cargo parametros
  req.session.nombre = req.body.nombre;
  req.session.edad = req.body.edad;
  req.session.exito = (msgError.length == 0);
  req.session.msgError = msgError;

  res.redirect('/');
});

app.get('/salir', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
