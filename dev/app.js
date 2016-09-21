/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({debug: true});

var queryParams = {
    $from: 'setores',
    $fields: ['id_setor', 'nome', {
        $left: 'unidades',
        $on: {
            $parent : 'id_unidade_customer',
            $child : 'id_unidade'
        },
        $fields: ['id_unidade', 'nome']
    }, {
        $right: 'usuarios',
        $on: {
            $parent : 'id_usuario_customer',
            $child : 'id_usuario'
        },
        $fields: ['id_usuario', 'nome']
    }, {
        $full: 'avioes',
        $on: {
            $parent : 'id_aviao_customer',
            $child : 'id_aviao'
        },
        $fields: ['id_aviao', 'nome']
    }]
};


var sqlQuery = sqlGenerator.select(queryParams);

