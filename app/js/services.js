module.exports = {
    
	// Decodifica base 64 con utf8
	// https://goo.gl/vAzWPO
	
	/**
	 * Decodifica en base 64 con utf8
	 * @link https://goo.gl/vAzWPO
	 *
	 * @method     b64_to_utf8
	 * @param      {string}  str     string codificado en base 64
	 * @return     {string}  string decodificado legible
	 */
	b64_to_utf8: function(str){    
       return decodeURIComponent(escape(window.atob(str)));
	},


   /**
    * Encuetra la diferencia entre dos archivos y lo imprime
    *
    * @method     diferencia
    * @param      {string}  a       Texto base a comparar
    * @param      {string}  b       Texto con modificaciones
    * @param      {string}  id      Id del elemento donde se desea ingresar el texto
    */
   diferencia: function(a, b, id) {

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
}