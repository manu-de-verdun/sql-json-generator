/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({showSQL: true});

var queryParams = {
    $from: 'setores',
    $fields: ['id_setor', 'nome'],
    $where: [{
        $field: 'nome',
        $like: '%prin%'
    }]
};


var sqlQuery = sqlGenerator.select(queryParams);

