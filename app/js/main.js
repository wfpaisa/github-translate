'use strict';

// var R = require ( 'Ramda');

// Revisare el corrector de idioma: "codemirror-spell-checker": "nextstepwebs/codemirror-spell-checker",
var branch = 'es';
var filePath = 'concepts/Assets/TaskAutomation.md';
var fork = 'wfpaisa/sails-docs';

var service = require('./services');

// crea token en: https://github.com/settings/tokens
// $.get('https://api.github.com/user?access_token=90d2977a99d409f9fd8dc4a3bd5a65866a019f5b', function(val){
// 	console.log(val)
// })



// Shorthand for $( document ).ready()
$(function() {

	// Inicia el markdown
	var simplemde = new SimpleMDE({
		element: $("#editor")[0],
		spellChecker: false,
		renderingConfig: {
			singleLineBreaks: false,
			codeSyntaxHighlighting: true,
		},

	});


	/* Retorna el contenido de un archivo
	 * Repositior principal
	 * sails-docs/concepts/Assets/TaskAutomation.md
	 * GET /repos/:owner/:repo/contents/:path
	 */
	var repoTraducida = new Promise(function(resolve, reject) {
		var url1 = `https://api.github.com/repos/${fork}/contents/${filePath}?ref=${branch}`;

		$.ajax({
			headers: {
				Accept: "application/vnd.github.v3.raw",
			},
			url: url1,
			method: "GET"
		}).done(function(data) {

			// Lleno el editor
			simplemde.value(data);

			resolve(data);

		}).fail(function(err) {
			console.log(err.responseText)
		})

	});

	/** 
	 * Repo desde el cual se  hiso la traducción
	 *
	 * Se busca el contenido del archivo en el estado del Sha encontrado en el comentario del
	 * commit del archivo.
	 */
	var repoBaseATraducir = new Promise(function(resolve, reject) {

		repoTraducida.then(function(val) {

			var url2 = `https://api.github.com/repos/${fork}/commits?path=${filePath}&sha=${branch}`

			$.get(url2, function(data) {

				var sha = JSON.parse(data[0].commit.message).sha;

				// Retorna el archivo del cual se realizo la traducción.
				$.get(`https://api.github.com/repos/${fork}/contents/${filePath}?ref=${sha}`, function(data) {
					resolve(service.b64_to_utf8(data.content));
				})

			});

		}, function(err) {
			if (err) console.log('error ')
		})
	});


	var repoMaster = new Promise(function(resolve, reject) {

		// Retorna el archivo del cual se realizo la traducción.
		$.get(`https://api.github.com/repos/${fork}/contents/${filePath}`, function(data) {
			resolve(service.b64_to_utf8(data.content));
		})

	})



	var repoTree = new Promise(function(resolve, reject) {

		$.get('https://api.github.com/repos/wfpaisa/sails-docs/git/trees/master', function(data) {

			data.tree.forEach(function(val) {

				var icon = '<span class="file-blank"></span>';

				if (val.type == 'tree') icon = '<i class="fa fa-folder-o"></i>';

				$('#tree ul').append(`<li>${icon} ${val.path}</li>`);

			});
		})
	})



	//R.map(double, [1, 2, 3]); //=> [2, 4, 6]



	// Se activa cuando estan,
	Promise.all([repoBaseATraducir, repoMaster]).then(function(values) {
		service.diferencia(values[0], values[1], 'diff');

	});

// Acciones tree
	$('#tree-menu').click(function(e){
		$('#tree').fadeIn();
	})
	$('#tree-close').click(function(e){
		$('#tree').fadeOut();
	})


});



// Formato del que se espera la respueta
// https://developer.github.com/v3/media/
// acept: application/vnd.github.v3.html
// acept: application/vnd.github.v3.raw
// acept: application/vnd.github.v3.json

// Retorna el contenido de un archivo, ejemplos
// retorna el contenido del archivo de la rama es
// https://api.github.com/repos/wfpaisa/sails-docs/contents/concepts/Assets/DefaultTasks.md?ref=es
// https://api.github.com/repos/wfpaisa/sails-docs/concepts/Assets/TaskAutomation.md?ref=es"

// este consulta de este commit: 73f0b053ff4636f0d5c6d8ca06dc2cd652264fe4 el archivo configuration
// https://api.github.com/repos/wfpaisa/sails-docs/contents/concepts/Configuration/Configuration.md?ref=73f0b053ff4636f0d5c6d8ca06dc2cd652264fe4 


// Retorna el  historico de un archivo
// https://api.github.com/repos/wfpaisa/sails-docs/commits?path=concepts/Assets/TaskAutomation.md&sha=es

// Retorna el commit
// https://api.github.com/repos/wfpaisa/sails-docs/commits/b3ab76b9346ef8948548d632d0587b77cac523d0


// tree
// https://api.github.com/repos/wfpaisa/sails-docs/git/commits/e73f0810397fe1a131940456034d456880f23dbb
// https://api.github.com/repos/wfpaisa/sails-docs/git/trees/85ea943fcb2fb8c91d2a07dcbd4966c1bf9b1ae3?recursive=1

// Retorna el contenido de un archivo segun su sha
// https://api.github.com/repos/wfpaisa/sails-docs/git/blobs/5574d99ab399479327b1ab65dadc0c1191f3eac6



// $.get(url1)
//     .done(function(data) {
//         // Prepara para editar la ultima edición del archivo
//         simplemde.value(service.b64_to_utf8(data.content));
//         $("#diff").html(JSON.stringify(data))

//         resolve(data);
//     }).fail(function(err) {
//         console.log(err)
//     });