/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator(true);
var sqlParams = {};

sqlParams = {
    $from: 'setores',
    $fields: [
        'id_setor',
        'nome',
        {
            $left: 'unidades',
            $using: 'id_unidade',
            $fields: [
                'id_unidade',
                'nome'
            ]
        },
        {
            $right: 'usuarios',
            $using: 'id_usuario',
            $fields: [
                'id_usuario',
                'nome'
            ]
        },
        {
            $full: 'avioes',
            $using: 'id_aviao',
            $fields: [
                'id_aviao',
                'nome'
            ]
        }
    ]
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
