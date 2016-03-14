'use strict';

const service = require('./services');
const confg = require('./confg');

// User
const owner = 'wfpaisa';

// Fork repo
const repo = 'sails-docs';

// File path
var filePath = 'README.md';

// Branch to translate
var branch = 'es-ES';

// Ruta del directorio activo
var treePath = {};

treePath.actualpath = '/';
treePath.breadcrumb = [{
    "sha": 'es-ES',
    "path": '',
    "name": 'root'
}];

/* 
 // Token
$.get(`https://api.github.com/user?access_token=${config.token}`, function(val){
	console.log(val)
})
*/

// Document ready
$(function() {

    // Acciones tree
    $('#tree-menu').click(function(e) {
        $('#tree').show();
        $('#tree-close').show();

    })
    $('#tree-close').click(function(e) {
        $('#tree').fadeOut();
        $('#tree-close').fadeOut();
    })


    // Inicia el markdown
    var simplemde = new SimpleMDE({
        element: $("#editor")[0],
        spellChecker: false,
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
        },

    });

    // Carga los elementos de la carpeta que se pase por parametro
    function tree(pasSha, pasPath) {


        // elmino el contenido del ul
        $('#tree-content').html('');


        // Tree file 
        var repoTree = new Promise(function(resolve, reject) {

            $.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${pasSha}`, function(data) {

                data.tree.forEach(function(val) {


                    let icon = (val.type === 'tree') ? '<i class="fa fa-folder-o"></i>' : '<span class="file-blank"></span>';

                    let pathR = (pasPath === '') ? val.path : pasPath + '/' + val.path;

                    $('#tree-content').append(`<li class="tree-item" sha="${val.sha}" path="${pathR}" name="${val.path}" type="${val.type}" >${icon} ${val.path}</li>`);

                });
            })
        })
    }



    // ARBOL DE ELEMENTOS
    // Si el elemento que se abre es un archivo lo muestra
    // de lo contrario carga los elementos del directorio  
    $("#tree-content").on("click", ".tree-item", function(element) {

        let nObj = {
            sha: $(element.currentTarget).attr('sha'),
            path: $(element.currentTarget).attr('path'),
            type: $(element.currentTarget).attr('type'),
            name: $(element.currentTarget).attr('name'),
        }



        if (nObj.type === "tree") {

            // Carga el arbol de elementos    
            tree(nObj.sha, nObj.path);

            // Carga el arbol de elementos
            treePath.breadcrumb.push({
                "sha": nObj.sha,
                "path": nObj.path,
                "name": nObj.name
            })

            $('#tree-breadcrumb').html('');

            treePath.breadcrumb.forEach(function(val) {
                $('#tree-breadcrumb').append(`<li class="tree-item" sha="${val.sha}" path="${val.path}" name="${val.name}" type="tree">${val.name}</li>`);
            })

        }


        // Carga el archivo en el editor
        if (nObj.type === "blob") {
            $('#tree').fadeOut();
            $('#tree-close').fadeOut();
            editFile(nObj.sha, nObj.path);
        }

    });




    // BREADCRUMBS
    $("#tree-breadcrumb").on("click", ".tree-item", function(element) {

        let nObj = {
            sha: $(element.currentTarget).attr('sha'),
            path: $(element.currentTarget).attr('path'),
            type: $(element.currentTarget).attr('type'),
            name: $(element.currentTarget).attr('name'),
        }

        let okArray = true;
        let tempArray = [];

        // Carga el arbol de elementos    
        tree(nObj.sha, nObj.path);

        // Construlle un nuevo array hasta el punto donde se 
        // le dio click
        for (let i in treePath.breadcrumb) {
            if (okArray) {
                tempArray.push(treePath.breadcrumb[i])
                if (treePath.breadcrumb[i].path === nObj.path) okArray = false
            }
        }

        treePath.breadcrumb = tempArray;

        $('#tree-breadcrumb').html('');

        tempArray.forEach(function(val) {
            $('#tree-breadcrumb').append(`<li class="tree-item" sha="${val.sha}" path="${val.path}" name="${val.name}" type="tree">${val.name}</li>`);
        })

    });




    // CARGA UN ARCHIVO EN EL EDITOR
    function editFile(pasSha, pasPath) {

        /* Retorna el contenido de un archivo
         * Repositior principal
         * sails-docs/concepts/Assets/TaskAutomation.md
         * GET /repos/:owner/:repo/contents/:path
         */
        var repoTraducida = new Promise(function(resolve, reject) {

            let url = `https://api.github.com/repos/${owner}/${repo}/contents/${pasPath}?ref=${branch}`;

            console.log('get: ', url)

            $.ajax({
                headers: {
                    Accept: "application/vnd.github.v3.raw",
                },
                url: url,
                method: "GET"
            }).done(function(data) {

                // Lleno el editor
                simplemde.value(data);

                resolve(data);

            }).fail(function(err) {
                console.log(err.responseText);
            })
            //fin ajax

        });
        //fin repoTraducida
    }
    //fin editFile





    // /** 
    //  * Repo desde el cual se  hiso la traducción
    //  *
    //  * Se busca el contenido del archivo en el estado del Sha encontrado en el comentario del
    //  * commit del archivo.
    //  */
    // var repoBaseATraducir = new Promise(function(resolve, reject) {

    // 	repoTraducida.then(function(val) {

    // 		var url2 = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&sha=${branch}`

    // 		$.get(url2, function(data) {

    // 			var sha = JSON.parse(data[0].commit.message).sha;

    // 			// Retorna el archivo del cual se realizo la traducción.
    // 			$.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${sha}`, function(data) {
    // 				resolve(service.b64_to_utf8(data.content));
    // 			})

    // 		});

    // 	}, function(err) {
    // 		if (err) console.log('error ')
    // 	})
    // });


    // var repoMaster = new Promise(function(resolve, reject) {

    // 	// Retorna el archivo del cual se realizo la traducción.
    // 	$.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, function(data) {
    // 		resolve(service.b64_to_utf8(data.content));
    // 	})

    // })


    // // Se activa cuando estan,
    // Promise.all([repoBaseATraducir, repoMaster]).then(function(values) {
    // 	service.diferencia(values[0], values[1], 'diff');

    // });



    // Inicializo los elementos del arbol
    tree('es-ES', '');

    // Creo el primer breadcrumb
    $('#tree-breadcrumb').append(`<li class="tree-item" sha="${treePath.breadcrumb[0].sha}" path="${treePath.breadcrumb[0].path}" name="${treePath.breadcrumb[0].name}" type="tree">${treePath.breadcrumb[0].name}</li>`);


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