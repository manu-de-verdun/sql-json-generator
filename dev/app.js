/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, escaped: true });

var queryParams = {
    $from: 'categorias_unidades_medidas',
    $fields: [{
        $field: 'sigla',
        $function: 1,
        $as: 'unidade'
    }]
};


var sqlQuery = sqlGenerator.select(queryParams);

