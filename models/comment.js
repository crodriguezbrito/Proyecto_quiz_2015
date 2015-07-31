// Definicion del modelo de Comment con validacion

module.exports = function(sequelize, Datatypes) {
	return sequelize.define(
		'Comment',
		{ texto: {
			type: Datatypes.STRING,
			validate: { notEmpty: {msg: "-> Falta comentario"}}
		}
		}
	);
} 
