/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({debug: true});

var queryParams = {
    $from: 'setores',
    $fields: ['id_setor', 'nome', {
        $inner: 'unidades',
        $on: {
            $parent : 'id_unidade_customer',
            $child : 'id_unidade'
        },
        $fields: ['id_unidade', 'nome']
    }]
};


var sqlQuery = sqlGenerator.select(queryParams);

