var models = require('../models/models.js');

//Autoload :id de comentarios
exports.load = function(req, res, next, commentId){
	models.Comment.find({
		where:{
			id: Number(commentId)
		}
	}).then(function(comment){
		if (comment) {
			req.comment = comment;
			next();
		} else{next(new Error('No existe comentId=' + commentId))}
	}
	).catch(function(error){next(error)});
};

//GET /quizes/:quizId/comments/new
exports.new = function (req, res) {
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

//Post /quizes/:quizId/comments
exports.create = function (req,res) {
	var comment = models.Comment.build(
		{ texto: req.body.comment.texto,
		  QuizId: req.params.quizId //La relacion belongsTo() de Comment a Quiz añade un parametro :quizId adicional a  cada elemento de la tabla Comments que indica el quiz asociado. Se utiliza el nombre :quizId definido en la ruta en routes/index.js, salvo que se indique otro nombre.
		});
	comment
	.validate()
	.then(
		function(err){
			if(err) {
				res.render('comments/new.ejs', {comment: comment, errors: err.errors});
			} else {
				comment //save: guarda en DB campo texto de comment
				.save()
				.then( function(){ res.redirect('/quizes/'+req.params.quizId)})
			} //res.redirect: Redireccion HTTP a lista de preguntas
		}
	).catch(function(error){next(error)});
}; 

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {  //La ruta de la accion publish lleva :comentId y necesita autoload
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
	   .then( function(){ res.redirect('/quizes/'+req.params.quizId);} )
	   .catch(function(error){next(error)});
};