/**
 * Created by manu on 12/08/2016.
 */
var colors = require('colors');
var SQLGenerator = require('../index');

var sqlGenerator = new SQLGenerator({ debug: true, escaped: true });

var queryParams = {
            $from: 'gesup_usuarios_perfis_privilegios',
            $fields: ['id_categoria_gesup', 'id_categoria_gesup_acao'],
            $where: [{
                field_a: "string n' roses"
            }]
};


var sqlQuery = sqlGenerator.select(queryParams);

