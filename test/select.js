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
            $from: 'table1',
            $where: [{
                id_mi_item_inventario: 3
            }]
        };

        expect(sqlGenerator.select(sqlParams)).to.be.null;

    });


    it('call with missing $fields', function () {

        sqlParams = {
            $from: 'table1',
            $where: [{
                id_mi_item_inventario: 3
            }]
        };

        expect(sqlGenerator.select(sqlParams)).to.be.null;

    })


    it('call with empty $fields', function () {

        sqlParams = {
            $from: 'table1',
            $where: [{
                id_mi_item_inventario: 3
            }],
            $fields: []
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


    it('$field $count', function () {

        sqlParams = {
            $from: 'chamados_logs',
            $fields: [{
                $field: 'id_chamado_log',
                $count: 1,
                $as: 'total'
            }]
        };

        var expectedResult = 'SELECT COUNT(`chamados_logs`.`id_chamado_log`) AS total FROM `chamados_logs`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$field $avg', function () {

        sqlParams = {
            $from: 'chamados_logs',
            $fields: [{
                $field: 'id_chamado_log',
                $avg: 1,
                $as: 'total'
            }]
        };

        var expectedResult = 'SELECT AVG(`chamados_logs`.`id_chamado_log`) AS total FROM `chamados_logs`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$field $min', function () {

        sqlParams = {
            $from: 'chamados_logs',
            $fields: [{
                $field: 'id_chamado_log',
                $min: 1,
                $as: 'total'
            }]
        };

        var expectedResult = 'SELECT MIN(`chamados_logs`.`id_chamado_log`) AS total FROM `chamados_logs`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$field $max', function () {

        sqlParams = {
            $from: 'chamados_logs',
            $fields: [{
                $field: 'id_chamado_log',
                $max: 1,
                $as: 'total'
            }]
        };

        var expectedResult = 'SELECT MAX(`chamados_logs`.`id_chamado_log`) AS total FROM `chamados_logs`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$field $sum', function () {

        sqlParams = {
            $from: 'chamados_logs',
            $fields: [{
                $field: 'id_chamado_log',
                $sum: 1,
                $as: 'total'
            }]
        };

        var expectedResult = 'SELECT SUM(`chamados_logs`.`id_chamado_log`) AS total FROM `chamados_logs`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });



    it('$field $upper', function () {

        sqlParams = {
            $from: 'categorias_unidades_medidas',
            $fields: [{
                $field: 'sigla',
                $upper: 1,
                $as: 'unidade'
            }]
        };

        var expectedResult = 'SELECT UPPER(`categorias_unidades_medidas`.`sigla`) AS unidade FROM `categorias_unidades_medidas`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$field $lower', function () {

        sqlParams = {
            $from: 'categorias_unidades_medidas',
            $fields: [{
                $field: 'sigla',
                $lower: 1,
                $as: 'unidade'
            }]
        };

        var expectedResult = 'SELECT LOWER(`categorias_unidades_medidas`.`sigla`) AS unidade FROM `categorias_unidades_medidas`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$field $groupConcat', function () {

        sqlParams = {
            $from: 'estoques',
            $fields: [
                'id_estoque',
                {
                    $inner: 'estoques_departamentos',
                    $using: 'id_estoque',
                    $fields: [
                        {
                            $field: 'id_categoria_insumo_departamento',
                            $groupConcat: 1,
                            $as: 'departamentos'
                        }
                        
                    ]
                }
            ]
        };

        var expectedResult = 'SELECT `estoques`.`id_estoque`, GROUP_CONCAT(`estoques_departamentos`.`id_categoria_insumo_departamento`) AS departamentos FROM `estoques` INNER JOIN `estoques_departamentos` USING(`id_estoque`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('$field $function', function () {

        sqlParams = {
            $from: 'categorias_unidades_medidas',
            $fields: [{
                $field: 'sigla',
                $function: 'ACOS'
            }]
        };

        var expectedResult = 'SELECT ACOS(`categorias_unidades_medidas`.`sigla`) FROM `categorias_unidades_medidas`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });



    it('$field $function not a string', function () {

        sqlParams = {
            $from: 'categorias_unidades_medidas',
            $fields: [{
                $field: 'sigla',
                $function: 1
            }]
        };

        var expectedResult = 'SELECT `categorias_unidades_medidas`.`sigla` FROM `categorias_unidades_medidas`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$inner $using $count', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', 'nome', {
                    $field: 'id_unidade',
                    $avg: 1,
                    $as: 'average'
                }]
            }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome`, AVG(`unidades`.`id_unidade`) AS average FROM `setores` INNER JOIN `unidades` USING(`id_unidade`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$inner $using $count $table', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', 'nome']
            },
                {
                    $table: 'unidades',
                    $field: 'id_unidade',
                    $avg: 1,
                    $as: 'average'
                }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome`, AVG(`unidades`.`id_unidade`) AS average FROM `setores` INNER JOIN `unidades` USING(`id_unidade`)';

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


    it('$inner $on', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $inner: 'unidades',
                $on: {
                    $parent: 'id_unidade_customer',
                    $child: 'id_unidade'
                },
                $fields: ['id_unidade', 'nome']
            }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` ON `setores`.`id_unidade_customer` = `unidades`.`id_unidade`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('nested $inner $on', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', {
                $field: 'nome',
                $as: 'setor'
            }, {
                    $inner: 'unidades',
                    $on: {
                        $parent: 'id_unidade',
                        $child: 'id_unidade'
                    },
                    $fields: ['id_unidade', {
                        $field: 'nome',
                        $as: 'unidade'
                    }, {
                            $inner: 'entidades',
                            $on: {
                                $parent: 'id_entidade',
                                $child: 'id_entidade'
                            },
                            $fields: ['id_entidade', {
                                $field: 'sigla',
                                $as: 'entidade'
                            }]
                        }]
                }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome` AS setor, `unidades`.`id_unidade`, `unidades`.`nome` AS unidade, `entidades`.`id_entidade`, `entidades`.`sigla` AS entidade FROM `setores` INNER JOIN `unidades` ON `setores`.`id_unidade` = `unidades`.`id_unidade` INNER JOIN `entidades` ON `unidades`.`id_entidade` = `entidades`.`id_entidade`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$left $right $full  $on', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $left: 'unidades',
                $on: {
                    $parent: 'id_unidade_customer',
                    $child: 'id_unidade'
                },
                $fields: ['id_unidade', 'nome']
            }, {
                    $right: 'usuarios',
                    $on: {
                        $parent: 'id_usuario_customer',
                        $child: 'id_usuario'
                    },
                    $fields: ['id_usuario', 'nome']
                }, {
                    $full: 'avioes',
                    $on: {
                        $parent: 'id_aviao_customer',
                        $child: 'id_aviao'
                    },
                    $fields: ['id_aviao', 'nome']
                }]
        };

        var expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome`, `usuarios`.`id_usuario`, `usuarios`.`nome`, `avioes`.`id_aviao`, `avioes`.`nome` FROM `setores` LEFT JOIN `unidades` ON `setores`.`id_unidade_customer` = `unidades`.`id_unidade` RIGHT JOIN `usuarios` ON `setores`.`id_usuario_customer` = `usuarios`.`id_usuario` FULL JOIN `avioes` ON `setores`.`id_aviao_customer` = `avioes`.`id_aviao`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$inner $on (array)', function () {

        sqlParams = {
            $from: 'chamados_logs',
            $fields: ['id_chamado_log', 'id_chamado', 'id_categoria_responsavel_chamado', 'id_setor_responsavel', 'timestamp', 'log', {
                $inner: 'categorias_responsaveis_chamados',
                $on: [{
                    $parent: 'id_categoria_responsavel_chamado',
                    $child: 'id_categoria_responsavel_chamado'
                }, {
                    $parent: 'id_setor_responsavel',
                    $child: 'id_setor_responsavel'
                }],
                $fields: [{
                    $field: 'nome',
                    $as: 'crc'
                }]
            }],
            $where: [{
                $field: "id_chamado",
                $eq: 28200
            }]
        };

        var expectedResult = 'SELECT `chamados_logs`.`id_chamado_log`, `chamados_logs`.`id_chamado`, `chamados_logs`.`id_categoria_responsavel_chamado`, `chamados_logs`.`id_setor_responsavel`, `chamados_logs`.`timestamp`, `chamados_logs`.`log`, `categorias_responsaveis_chamados`.`nome` AS crc FROM `chamados_logs` INNER JOIN `categorias_responsaveis_chamados` ON (`chamados_logs`.`id_categoria_responsavel_chamado` = `categorias_responsaveis_chamados`.`id_categoria_responsavel_chamado` AND `chamados_logs`.`id_setor_responsavel` = `categorias_responsaveis_chamados`.`id_setor_responsavel` ) WHERE `chamados_logs`.`id_chamado` = \'28200\'';

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
                $field: 'id_perfil',
                $in: [2, 4, 7]
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
                $field: 'id_perfil',
                $in: ['AA', 'BB', 'CC']
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
                $field: 'id_perfil',
                $in: []
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
                $field: 'id_perfil',
                $in: 12
            }]
        };

        var expectedResult = "SELECT `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup`, `gesup_usuarios_perfis_privilegios`.`id_categoria_gesup_acao` FROM `gesup_usuarios_perfis_privilegios`";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$where using full field notation', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', 'nome']
            }],
            $where: [{
                $table: 'setores',
                $field: 'ativo',
                $eq: 1
            }, {
                $table: 'unidades',
                $field: 'ativo',
                $eq: 1
            }]
        };

        var expectedResult = "SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` USING(`id_unidade`) WHERE `setores`.`ativo` = '1' AND `unidades`.`ativo` = '1'";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$where using full field notation with optional $table', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome', {
                $inner: 'unidades',
                $using: 'id_unidade',
                $fields: ['id_unidade', 'nome']
            }],
            $where: [{
                $field: 'ativo',
                $eq: 1
            }, {
                $table: 'unidades',
                $field: 'ativo',
                $eq: 1
            }]
        };

        var expectedResult = "SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` USING(`id_unidade`) WHERE `setores`.`ativo` = '1' AND `unidades`.`ativo` = '1'";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$where $like', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome'],
            $where: [{
                $field: 'nome',
                $like: '%prin%'
            }]
        };

        var expectedResult = "SELECT `setores`.`id_setor`, `setores`.`nome` FROM `setores` WHERE `setores`.`nome` LIKE '%prin%'";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$sqlCalcFoundRows', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome'],
            $where: [],
            $sqlCalcFoundRows: true,
            $limit: {
                $rows: 20,
                $offset: 0
            }
        };

        var expectedResult = "SELECT SQL_CALC_FOUND_ROWS `setores`.`id_setor`, `setores`.`nome` FROM `setores` LIMIT 0,20";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$sqlCalcFoundRows without $limit', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome'],
            $where: [],
            $sqlCalcFoundRows: true
        };

        var expectedResult = "SELECT `setores`.`id_setor`, `setores`.`nome` FROM `setores`";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$sqlCalcFoundRows', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome'],
            $where: [],
            $sqlCalcFoundRows: true,
            $limit: {
                $rows: 20,
                $offset: 0
            }
        };

        var expectedResult = "SELECT SQL_CALC_FOUND_ROWS `setores`.`id_setor`, `setores`.`nome` FROM `setores` LIMIT 0,20";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$sqlCalcFoundRows false', function () {

        sqlParams = {
            $from: 'setores',
            $fields: ['id_setor', 'nome'],
            $where: [],
            $sqlCalcFoundRows: false,
            $limit: {
                $rows: 20,
                $offset: 0
            }
        };

        var expectedResult = "SELECT `setores`.`id_setor`, `setores`.`nome` FROM `setores` LIMIT 0,20";

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$group', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
            $where: [{
                'deleted': 0
            }],
            $group: ['arquivado']
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` FROM `mi_itens_inventarios` WHERE `mi_itens_inventarios`.`deleted` = \'0\' GROUP BY `mi_itens_inventarios`.`arquivado`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$group $as', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', {
                $field: 'id_modelo_insumo',
                $as: 'id'
            }],
            $group: [{
                $as: 'id'
            }]
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` AS id FROM `mi_itens_inventarios` GROUP BY `mi_itens_inventarios`.`id_modelo_insumo`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$group multiple', function () {

        sqlParams = {
            $from: 'mi_itens_inventarios',
            $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
            $group: ['arquivado', 'deleted']
        };

        var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` FROM `mi_itens_inventarios` GROUP BY `mi_itens_inventarios`.`arquivado` ,`mi_itens_inventarios`.`deleted`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$group complex', function () {

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
            $group: [{
                $table: 'categorias_insumos_departamentos',
                $field: 'nome'
            }, 'categoria', {
                $as: 'modelo'
            }]
        };

        var expectedResult = 'SELECT `modelos_insumos`.`codigo`, `modelos_insumos`.`nome` AS modelo, `modelos_insumos`.`lote`, `modelos_insumos`.`fracionamento`, `categorias_insumos`.`nome` AS categoria, `categorias_insumos_departamentos`.`nome` AS departamento, `categorias_unidades_medidas`.`sigla` AS unidade FROM `modelos_insumos` INNER JOIN `categorias_insumos` USING(`id_categoria_insumo`) INNER JOIN `categorias_insumos_departamentos` USING(`id_categoria_insumo_departamento`) INNER JOIN `categorias_unidades_medidas` USING(`id_categoria_unidade_medida`) GROUP BY `categorias_insumos_departamentos`.`nome` ,`categorias_insumos`.`nome` ,`modelos_insumos`.`nome`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    describe('#select - Having', function () {

        var sqlGenerator = new SQLGenerator();
        var sqlParams;

    });


    describe('#select - $raw attribute', function () {

        var sqlGenerator = new SQLGenerator();
        var sqlParams;

        it('$raw in SELECT', function () {

            sqlParams = {
                $from: 'mi_itens_inventarios',
                $fields: ['id_mi_item_inventario', {
                    $raw: "MAX(`fieldA`) as max"
                }]
            };

            var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, MAX(`fieldA`) as max FROM `mi_itens_inventarios`';

            sqlGenerator.select(sqlParams).should.equal(expectedResult);
        });

        it('$raw in SELECT (double)', function () {

            sqlParams = {
                $from: 'mi_itens_inventarios',
                $fields: ['id_mi_item_inventario', {
                    $raw: "MAX(`fieldA`) as max"
                }, {
                        $raw: "MIN(`fieldA`) as min"
                    }]
            };

            var expectedResult = 'SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, MAX(`fieldA`) as max, MIN(`fieldA`) as min FROM `mi_itens_inventarios`';

            sqlGenerator.select(sqlParams).should.equal(expectedResult);
        });


        it('$raw in WHERE', function () {

            sqlParams = {
                $from: 'table1',
                $fields: ['field_a'],
                $where: [{
                    $raw: "field_a = 12"
                }]
            };

            var expectedResult = 'SELECT `table1`.`field_a` FROM `table1` WHERE field_a = 12';

            sqlGenerator.select(sqlParams).should.equal(expectedResult);
        });

        it('$raw in ORDER', function () {

            sqlParams = {
                $from: 'mi_itens_inventarios',
                $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
                $where: [{
                    'deleted': 0
                }, {
                    'arquivado': 0
                }],
                $order: [{ $raw: '`mi_itens_inventarios` DESC, `id_modelo_insumo`' }]
            };

            var expectedResult = "SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` FROM `mi_itens_inventarios` WHERE `mi_itens_inventarios`.`deleted` = '0' AND `mi_itens_inventarios`.`arquivado` = '0' ORDER BY `mi_itens_inventarios` DESC, `id_modelo_insumo`";

            sqlGenerator.select(sqlParams).should.equal(expectedResult);
        });

        it('$raw in GROUP BY', function () {

            sqlParams = {
                $from: 'mi_itens_inventarios',
                $fields: ['id_mi_item_inventario', 'id_modelo_insumo'],
                $where: [{
                    'deleted': 0
                }, {
                    'arquivado': 0
                }],
                $group: [{ $raw: '`mi_itens_inventarios`, `id_modelo_insumo`' }]
            };

            var expectedResult = "SELECT `mi_itens_inventarios`.`id_mi_item_inventario`, `mi_itens_inventarios`.`id_modelo_insumo` FROM `mi_itens_inventarios` WHERE `mi_itens_inventarios`.`deleted` = '0' AND `mi_itens_inventarios`.`arquivado` = '0' GROUP BY `mi_itens_inventarios`, `id_modelo_insumo`";

            sqlGenerator.select(sqlParams).should.equal(expectedResult);
        });


        it('$raw in HAVING', function () {

            sqlParams = {
                $from: 'pessoas_fisicas',
                $fields: [
                    'data_nascimento',
                    {
                        $field: 'data_nascimento',
                        $count: 1,
                        $as: 'count'
                    }
                ],
                $where: [{
                    $table: "pessoas_fisicas",
                    $field: "nome",
                    $like: "%joao%"
                },
                {
                    $as: 'count',
                    $gt: 1
                }],
                $group: [
                    { $as: 'count' }
                ],
                $having: [
                    {
                        $raw: "`count` > 1"
                    }
                ]
            };

            var expectedResult = "SELECT `pessoas_fisicas`.`data_nascimento`, COUNT(`pessoas_fisicas`.`data_nascimento`) AS count FROM `pessoas_fisicas` WHERE `pessoas_fisicas`.`nome` LIKE '%joao%' GROUP BY `pessoas_fisicas`.`data_nascimento` HAVING `count` > 1";

            sqlGenerator.select(sqlParams).should.equal(expectedResult);
        });
    });
});






