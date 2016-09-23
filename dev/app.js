/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true });

var queryParams = {
    $from: 'setores',
    $fields: ['id_setor', 'nome', {
        $inner: 'unidades',
        $using: 'id_unidade',
        $fields: ['id_unidade', 'nome']
    },
        {
            $table: 'unidades',
            $field: 'id_unidade',
            $avg: 1,
            $as: 'average'
        }]
};


var sqlQuery = sqlGenerator.select(queryParams);

