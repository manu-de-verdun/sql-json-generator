/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, escaped: true });

var queryParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
            $where: [{
                'deleted': 0
            }, {
                'arquivado': 0
            }],
            $order: [{ $raw: '`mi_itens_inventarios` DESC, `id_modelo_insumo` '}]
            };


var sqlQuery = sqlGenerator.select(queryParams);

