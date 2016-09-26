/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true });

var queryParams = {
    $from: 'modelos_insumos',
    $fields: ['codigo', {
        $field: 'nome',
        $as: 'modelo'
    }, 'lote', 'fracionamento', {
            $inner: 'categorias_insumos',
            $using: 'id_categoria_insumo',
            $fields: [{
                $field: 'nome',
                $as: 'categoria'
            }, {
                    $inner: 'categorias_insumos_departamentos',
                    $using: 'id_categoria_insumo_departamento',
                    $fields: [{
                        $field: 'nome',
                        $as: 'departamento'
                    },]
                }]
        }, {
            $inner: 'categorias_unidades_medidas',
            $using: 'id_categoria_unidade_medida',
            $fields: [{
                $field: 'sigla',
                $as: 'unidade'
            },]
        }],
    $group: [{
        $table: 'categorias_insumos_departamentos',
        $field: 'nome'
    }, 'categoria', {
            $as: 'modelo'
        }]
};


var sqlQuery = sqlGenerator.select(queryParams);

