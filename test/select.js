var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#select - json errors', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;

    it('call without params', function () {

        expect(sqlGenerator.select()).to.be.null;

    });


    it('call with missing $select', function () {

        sqlParams = {
            $where: [{
                id_mi_item_inventario: 3
            }]
        };

        expect(sqlGenerator.select(sqlParams)).to.be.null;

    });


});


describe('#select - queries', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;


    it('simple field', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                field_d: 1
            }]
        };

        var expectedResult = 'SELECT `table1`.`field_a` FROM `table1` WHERE `table1`.`field_d` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('multiple fields', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a', 'field_b', 'field_c'],
            $where: [{
                field_d: 1
            }]
        };

        var expectedResult = 'SELECT `table1`.`field_a`, `table1`.`field_b`, `table1`.`field_c` FROM `table1` WHERE `table1`.`field_d` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('multiple wrapped fields', function () {

        sqlParams = {
            $from: 'table1',
            $fields: [{
                $field: 'column_a'
            }, {
                $field: 'column_b'
            }]
        };

        var expectedResult = 'SELECT `table1`.`column_a`, `table1`.`column_b` FROM `table1`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('multiple $as fields', function () {

        sqlParams = {
            $from: 'table1',
            $fields: [{
                $field: 'column_a',
                $as: "new_column_a"
            }, {
                $field: 'column_b',
                $as: "new_column_b"
            }]
        };

        var expectedResult = 'SELECT `table1`.`column_a` AS new_column_a, `table1`.`column_b` AS new_column_b FROM `table1`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('call with missing $where', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: []
        };

        var expectedResult = 'SELECT `table1`.`field_a` FROM `table1`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);

    });

    it('$inner $using', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', 'nome']
            }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` USING(`id_unidade`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$inner $using $as', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', {
                $field: 'nome',
                $as: 'setor'
            }, {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', {
                    $field: 'nome',
                    $as: 'unidade'
                }]
            }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome` AS setor, `unidades`.`id_unidade`, `unidades`.`nome` AS unidade FROM `setores` INNER JOIN `unidades` USING(`id_unidade`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('nested $inner $using $as', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', {
                $field: 'nome',
                $as: 'setor'
            }, {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', {
                    $field: 'nome',
                    $as: 'unidade'
                }, {
                    $inner: 'entidades',
                    $using: 'id_entidade',
                    $fields: ['id_entidade', {
                        $field: 'sigla',
                        $as: 'entidade'
                    }]
                }]
            }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome` AS setor, `unidades`.`id_unidade`, `unidades`.`nome` AS unidade, `entidades`.`id_entidade`, `entidades`.`sigla` AS entidade FROM `setores` INNER JOIN `unidades` USING(`id_unidade`) INNER JOIN `entidades` USING(`id_entidade`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$inner $using $where', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', 'nome']
            }],
            $where: [{
                ativo: 1
            }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` USING(`id_unidade`) WHERE `setores`.`ativo` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('nested $inner $using multiple $where', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', 'nome'],
                $where: [{
                    ativo: 1
                }]
            }],
            $where: [{
                ativo: 1
            }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` USING(`id_unidade`) WHERE `setores`.`ativo` = \'1\' AND `unidades`.`ativo` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$field $dateFormat', function () {

        sqlParams = {
            $from: 'mi_itens',
            $fields: ['id_mi_item', {
                $field: 'data',
                $dateFormat: '%Y-%m-%d',
                $as: 'data'
            }]
        };

        var expectedResult = 'SELECT `mi_itens`.`id_mi_item`, DATE_FORMAT(`mi_itens`.`data`,\'%Y-%m-%d\') AS data FROM `mi_itens`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$left $right $full $using', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $left: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', 'nome']
            }, {
                $right: 'usuarios',
                $using: 'id_usuario',
                $fields: ['id_usuario', 'nome']
            }, {
                $full: 'avioes',
                $using: 'id_aviao',
                $fields: ['id_aviao', 'nome']
            }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome`, `usuarios`.`id_usuario`, `usuarios`.`nome`, `avioes`.`id_aviao`, `avioes`.`nome` FROM `setores` LEFT JOIN `unidades` USING(`id_unidade`) RIGHT JOIN `usuarios` USING(`id_usuario`) FULL JOIN `avioes` USING(`id_aviao`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$limit', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
            $limit: {
                $offset: 0,
                $rows: 10
            }
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` FROM `mi_itens_inventarios` LIMIT 0,10';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$limit $where', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
            $where: [{
                'deleted': 0
            }, {
                'arquivado': 0
            }],
            $limit: {
                $offset: 10,
                $rows: 10
            }
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` FROM `mi_itens_inventarios` WHERE `mi_itens_inventarios`.`deleted` = \'0\' AND `mi_itens_inventarios`.`arquivado` = \'0\' LIMIT 10,10';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$order', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
            $where: [{
                'deleted': 0
            }, {
                'arquivado': 0
            }],
            $order: ['id_mi_item_inventario']
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` FROM `mi_itens_inventarios` WHERE `mi_itens_inventarios`.`deleted` = \'0\' AND `mi_itens_inventarios`.`arquivado` = \'0\' ORDER BY `mi_itens_inventarios`.`id_mi_item_inventario`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$order DESC', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
            $order: [{
                $field: 'id_mi_item_inventario',
                $desc: 1
            }]
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` FROM `mi_itens_inventarios` ORDER BY `mi_itens_inventarios`.`id_mi_item_inventario` DESC';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$order $as', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', {
                $field: 'id_modelo_insumo',
                $as: 'id'
            }],
            $order: ['id']
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` AS id FROM `mi_itens_inventarios` ORDER BY `mi_itens_inventarios`.`id_modelo_insumo`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$order $as', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', {
                $field: 'id_modelo_insumo',
                $as: 'id'
            }],
            $order: [{
                $as: 'id'
            }]
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` AS id FROM `mi_itens_inventarios` ORDER BY `mi_itens_inventarios`.`id_modelo_insumo`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$order $as $desc', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', {
                $field: 'id_modelo_insumo',
                $as: 'id'
            }],
            $order: [{
                $as: 'id',
                $desc: 1
            }]
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` AS id FROM `mi_itens_inventarios` ORDER BY `mi_itens_inventarios`.`id_modelo_insumo` DESC';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$order $as $desc complex', function () {

        sqlParams = {
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
            $order: [{
                $table: 'categorias_insumos_departamentos',
                $field: 'nome',
                $desc: 1
            }, 'categoria', {
                $as: 'modelo',
                $desc: 1
            }]
        };

        var expectedResult = 'SELECT `modelos_insumos`.`codigo`, `modelos_insumos`.`nome` AS modelo, `modelos_insumos`.`lote`, `modelos_insumos`.`fracionamento`, `categorias_insumos`.`nome` AS categoria, `categorias_insumos_departamentos`.`nome` AS departamento, `categorias_unidades_medidas`.`sigla` AS unidade FROM `modelos_insumos` INNER JOIN `categorias_insumos` USING(`id_categoria_insumo`) INNER JOIN `categorias_insumos_departamentos` USING(`id_categoria_insumo_departamento`) INNER JOIN `categorias_unidades_medidas` USING(`id_categoria_unidade_medida`) ORDER BY `categorias_insumos_departamentos`.`nome` DESC ,`categorias_insumos`.`nome` ,`modelos_insumos`.`nome` DESC';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$in numbers', function () {

        sqlParams = {
            $from: 'gesup_usuarios_perfis_privilegios',
            $fields: ['id_categoria_gesup', 'id_categoria_gesup_acao'],
            $where: [{
                'id_perfil': {
                    $in: [2, 4, 7]
                }
            }]
        };

        var expectedResult = "SELECT `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup`, `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup_acao` FROM `gesup_usuarios_perfis_privilegios` WHERE `gesup_usuarios_perfis_privilegios`.`id_perfil` IN ('2','4','7')";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('$in strings', function () {

        sqlParams = {
            $from: 'gesup_usuarios_perfis_privilegios',
            $fields: ['id_categoria_gesup', 'id_categoria_gesup_acao'],
            $where: [{
                'id_perfil': {
                    $in: ['AA', 'BB', 'CC']
                }
            }]
        };

        var expectedResult = "SELECT `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup`, `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup_acao` FROM `gesup_usuarios_perfis_privilegios` WHERE `gesup_usuarios_perfis_privilegios`.`id_perfil` IN ('AA','BB','CC')";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$in empty', function () {

        sqlParams = {
            $from: 'gesup_usuarios_perfis_privilegios',
            $fields: ['id_categoria_gesup', 'id_categoria_gesup_acao'],
            $where: [{
                'id_perfil': {
                    $in: []
                }
            }]
        };

        var expectedResult = "SELECT `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup`, `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup_acao` FROM `gesup_usuarios_perfis_privilegios`";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$in not an array', function () {

        sqlParams = {
            $from: 'gesup_usuarios_perfis_privilegios',
            $fields: ['id_categoria_gesup', 'id_categoria_gesup_acao'],
            $where: [{
                'id_perfil': {
                    $in: 12
                }
            }]
        };

        var expectedResult = "SELECT `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup`, `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup_acao` FROM `gesup_usuarios_perfis_privilegios`";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


});






