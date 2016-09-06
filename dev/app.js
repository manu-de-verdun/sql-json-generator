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
        $using: 'id_unidade',
        $fields: ['id_unidade', 'nome']
    }],
    $where: [{
        $table: 'setores',
        $field: 'ativo',
        $eq: 1
    },{
        $table: 'unidades',
        $field: 'ativo',
        $eq: 1
    }]
};


var sqlQuery = sqlGenerator.select(queryParams);

console.log(' ');
console.log(colors.cyan('%s'), sqlQuery);
