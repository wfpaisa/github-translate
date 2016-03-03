// Revisare el corrector de idioma: "codemirror-spell-checker": "nextstepwebs/codemirror-spell-checker",
var branch = 'es';
var filePath = 'concepts/Assets/TaskAutomation.md';
var fork = 'wfpaisa/sails-docs';


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

	// Decodifica base 64 con utf8
	// https://goo.gl/vAzWPO
	function b64_to_utf8(str) {
		return decodeURIComponent(escape(window.atob(str)));
	}

	function diferencia(a,b,id){

		var diff = JsDiff.diffWords(a, b);
		var display = document.getElementById(id);


		diff.forEach(function(part){

			var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
			var span = document.createElement('span');

			span.className = color;
			span.appendChild(document.createTextNode(part.value));
			display.appendChild(span);
		});
	}



	// Retorna el contenido de un archivo
	// sails-docs/concepts/Assets/TaskAutomation.md
	// GET /repos/:owner/:repo/contents/:path
	var url1 = 'https://api.github.com/repos/' + fork + '/contents/' + filePath + '?ref=' + branch;
	$.get(url1, function(data) {


		// Prepara para editar la ultima edición del archivo
		simplemde.value(b64_to_utf8(data.content));






		var url1 = 'https://api.github.com/repos/' + fork + '/contents/' + filePath + '?ref=' + branch;
		$.get(url1, function(data) {
			// Busca diferencias entre la versión ingles y la version español    
			var subA = b64_to_utf8(data.content)
			var subB = 'difeerencia \n' + b64_to_utf8(data.content)

			//diferencia(subA,subB,'diff')
			$('#diff').html('x')


		});    	
	});

});








// Retorna el contenido de un archivo
// https://api.github.com/repos/wfpaisa/sails-docs/contents/concepts/Assets/DefaultTasks.md?ref=es
// https://api.github.com/repos/wfpaisa/sails-docs/concepts/Assets/TaskAutomation.md?ref=es"

// Retorna el  historico de un archivo
// https://api.github.com/repos/wfpaisa/sails-docs/commits?path=concepts/Assets/TaskAutomation.md&sha=es

// Retorna el commit
// https://api.github.com/repos/wfpaisa/sails-docs/commits/b3ab76b9346ef8948548d632d0587b77cac523d0


// tree
// https://api.github.com/repos/wfpaisa/sails-docs/git/commits/e73f0810397fe1a131940456034d456880f23dbb
// https://api.github.com/repos/wfpaisa/sails-docs/git/trees/85ea943fcb2fb8c91d2a07dcbd4966c1bf9b1ae3?recursive=1










