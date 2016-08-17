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
            {
                $field: 'nome',
                $as: 'setor'
            },
            {
                $inner : 'unidades',
                $using : 'id_unidade',
                $fields : [
                    'id_unidade',
                    {
                        $field: 'nome',
                        $as: 'unidade'
                    },
                    {
                        $inner : 'entidades',
                        $using : 'id_entidade',
                        $fields : [
                            'id_entidade',
                            {
                                $field: 'sigla',
                                $as: 'entidade'
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

var sqlQuery = sqlGenerator.select(sqlParams);

console.log(' ');
console.log('Query: ', sqlQuery);
