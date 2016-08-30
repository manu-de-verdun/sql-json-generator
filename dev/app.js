/**
 * Created by manu on 12/08/2016.
 */
var SQLGenerator = require('../index');


var sqlGenerator = new SQLGenerator({debug: true});

var queryParams = {
    $from: 'gesup_usuarios_perfis_privilegios',
    $fields: ['id_categoria_gesup', 'id_categoria_gesup_acao'],
    $where: {
        'id_perfil': {
            $in: [2, 4, 7]
        }
    }
};


var sqlQuery = sqlGenerator.select(queryParams);

console.log(' ');
console.log('Query: ', sqlQuery);
