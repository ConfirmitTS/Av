/**
 * JSON utilities class that doesn't have a constructor. It's useful for printing Reportal validated objects as valid JSON for front-end JavaScript
 * @class JSON
 * */
class JSON
{
    /**
     * @memberOf JSON
     * @function stringify
     * @description Implements JSON.stringify serialization on Reportal backend side, prepares any Reportal object/array for JSON serialization for further use on the front-end
     *
     * @example
     * var a = {name: 'John', lastName: 'Doe', age:21, married:true, children:['Mary','Luke']}
     * JSON.stringify(a)
     * //returns {"name": "John"', "lastName": "Doe", "age":21, "married":true, "children":["Mary","Luke"]}
     *
     * @param {!(Object|Array)} obj - a Reportal object/array that needs to be presented as a valid JSON object
     * @return {String} Returns a string that is considered valid JSON if output to page as a JavaScript variable
     */
    static function stringify(obj) {
        //Escapes entities to be converted to JSON properly
        function escapeEntities(str) {
            var entitiesMap = {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '\"': '\\&quot;',
                '\'':'&amp;apos;'
            };
            return str.replace(/[&<>\"\']/g, function(key) {
                return entitiesMap[key];
            });
        }

        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"'+ escapeEntities(obj) +'"';
            else if(t=="number") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string"){
                    v = '"'+ escapeEntities(v) +'"';
                }
                else if (t == "object" && v !== null) v = stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    /**
     * @memberOf JSON
     * @function print
     * @description Prints JSON `obj` to the page as a JavaScript variable with a specified `configName`
     * @param {!(Object|Array)} obj - a Reportal object/array that needs to be presented as a valid JSON object
     * @param {String=} [varName='config'] - name of the Javascript variable the `obj` will define
     * @return {String} Returns a variable declaration wrapped into `<script>` tags
     * */
    static function print(obj, varName){
        varName = varName || 'config';
        return '<script type="text/javascript">var '+ varName + '=' + stringify(obj) +'</script>';
    };
}

