/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator();
var sqlParams = {};

sqlParams = {
    $select : {
        $from : 'setores',
        $fields : [
            'id_setor',
            'nome',
            {
                $inner : 'unidades',
                $using : 'id_unidade',
                $fields : [
                    'id_unidade',
                    'nome'
                ]
            }
        ],
        $where: {
            ativo: 1
        }
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
