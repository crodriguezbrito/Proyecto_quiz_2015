var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};


// GET /quizes
exports.index = function(req, res) {
	if (req.query.search) { //si en /quizes le hemos dado al botón buscar pregunta irá por aquí
		var busqueda = ('%' + req.query.search + '%').replace(/ /g, '%');  //No olvide delimitar el string contenido en search con el comodín % antes y después y cambie también los espacios en blanco por %. 
		models.Quiz.findAll({  // a la bbdd le pasamos que busque resultados que coincidan con la busqueda
			where: ["pregunta like ?", busqueda],
			order: 'pregunta ASC' // y lo ordene de modo ascendente
		}).then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}
		).catch(function(error) { next(error);})
	}
	else { 
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}
		).catch(function(error) { next(error);})
	}
};



// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta:"Pregunta", respuesta:"Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};


// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
   quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};