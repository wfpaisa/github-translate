'use strict';

// Revisare el corrector de idioma: "codemirror-spell-checker": "nextstepwebs/codemirror-spell-checker",
var branch = 'es';
var filePath = 'concepts/Assets/TaskAutomation.md';
var fork = 'wfpaisa/sails-docs';

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

    // Decodifica base 64 con utf8
    // https://goo.gl/vAzWPO
    function b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    function diferencia(a, b, id) {

        var diff = JsDiff.diffWords(a, b);
        var display = document.getElementById(id);


        diff.forEach(function(part) {

            var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
            var span = document.createElement('span');

            span.className = color;
            span.appendChild(document.createTextNode(part.value));
            display.appendChild(span);
        });
    }


    /* Retorna el contenido de un archivo
     * Repositior principal
     * sails-docs/concepts/Assets/TaskAutomation.md
     * GET /repos/:owner/:repo/contents/:path
     */
    var p1 = new Promise(function(resolve, reject) {
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

    // Compara
    var p2 = new Promise(function(resolve, reject) {
        
        p1.then(function(val) {

            var url2 = `https://api.github.com/repos/${fork}/commits?path=${filePath}&sha=${branch}`

            $.get(url2, function(data) {

                console.log(data[0].commit.message)
                resolve(data[0]);
            });

        }, function(err) {
            if (err) console.log('error ')
        })
    });

    // Promise.all([p1]).then(function(values) { 

    // 	// Prepara para editar la ultima edición del archivo
    // 	simplemde.value(b64_to_utf8(values[0].content));

    //   //console.log(values[0].sha); // [3, 1337, "foo"] 
    // });

    // var url1 = 'https://api.github.com/repos/' + fork + '/contents/' + filePath + '?ref=' + branch;
    // $.get(url1, function(data) {
    // 	// Busca diferencias entre la versión ingles y la version español    
    // 	var subA = b64_to_utf8(data.content);
    // 	var subB = 'difeerencia \n' + b64_to_utf8(data.content);

    // 	// Comparacion: (ArchivoViejo, ArchivoNuevo, idDivRender)
    // 	// diferencia(subA,subB,'diff');
    // 	var xs = 'hola'
    // 	$('#diff').html(`uno + ${xs}`);
    // });

});






// Formato del que se espera la respueta
// https://developer.github.com/v3/media/
// acept: application/vnd.github.v3.html
// acept: application/vnd.github.v3.raw
// acept: application/vnd.github.v3.json

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




// $.get(url1)
//     .done(function(data) {
//         // Prepara para editar la ultima edición del archivo
//         simplemde.value(b64_to_utf8(data.content));
//         $("#diff").html(JSON.stringify(data))

//         resolve(data);
//     }).fail(function(err) {
//         console.log(err)
//     });