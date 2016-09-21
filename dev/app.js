/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({debug: true});

var queryParams = {
    $from: 'chamados_logs',
        $fields: ['id_chamado_log', 'id_chamado', 'id_categoria_responsavel_chamado' , 'id_setor_responsavel' , 'timestamp' , 'log' , {
            $inner: 'categorias_responsaveis_chamados',
            $on : [{
                $parent : 'id_categoria_responsavel_chamado',
                $child: 'id_categoria_responsavel_chamado'
            },{
                $parent : 'id_setor_responsavel',
                $child: 'id_setor_responsavel'
            }],
            $fields: [{
                $field: 'nome',
                $as: 'crc'
            }]
        } ],
        $where: [{
            $field: "id_chamado",
            $eq : 28200
        }]
};


var sqlQuery = sqlGenerator.select(queryParams);

