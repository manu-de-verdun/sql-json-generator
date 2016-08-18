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
            $where: {
                id_mi_item_inventario: 3
            }
        };

        expect(sqlGenerator.select(sqlParams)).to.be.null;

    });

});


describe('#select - queries', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;


    it('simple field', function () {

        sqlParams = {
                $from : 'table1',
                $fields : [
                    'field_a'
                ],
                $where : {
                    field_d: 1
                }
        };

        expectedResult = 'SELECT `table1`.`field_a` FROM `table1` WHERE `table1`.`field_d` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('multiple fields', function () {

        sqlParams = {
                $from : 'table1',
                $fields : [
                    'field_a',
                    'field_b',
                    'field_c'
                ],
                $where : {
                    field_d: 1
                }
        };

        expectedResult = 'SELECT `table1`.`field_a`, `table1`.`field_b`, `table1`.`field_c` FROM `table1` WHERE `table1`.`field_d` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('multiple wrapped fields', function () {

        sqlParams = {
                $from: 'table1',
                $fields: [
                    {
                        $field: 'column_a'
                    },
                    {
                        $field: 'column_b'
                    }
                ]
        };

        expectedResult = 'SELECT `table1`.`column_a`, `table1`.`column_b` FROM `table1`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('multiple $as fields', function () {

        sqlParams = {
                $from: 'table1',
                $fields: [
                    {
                        $field: 'column_a',
                        $as: "new_column_a"
                    },
                    {
                        $field: 'column_b',
                        $as: "new_column_b"
                    }
                ]
        };

        expectedResult = 'SELECT `table1`.`column_a` AS new_column_a, `table1`.`column_b` AS new_column_b FROM `table1`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('$inner $using', function () {

        sqlParams = {
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
                ]
        };

        expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` USING(`id_unidade`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$inner $using $as', function () {

        sqlParams = {
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
                            }
                        ]
                    }
                ]
        };

        expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome` AS setor, `unidades`.`id_unidade`, `unidades`.`nome` AS unidade FROM `setores` INNER JOIN `unidades` USING(`id_unidade`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('nested $inner $using $as', function () {

        sqlParams = {
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
        };

        expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome` AS setor, `unidades`.`id_unidade`, `unidades`.`nome` AS unidade, `entidades`.`id_entidade`, `entidades`.`sigla` AS entidade FROM `setores` INNER JOIN `unidades` USING(`id_unidade`) INNER JOIN `entidades` USING(`id_entidade`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$inner $using $where', function () {

        sqlParams = {
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
        };

        expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` USING(`id_unidade`) WHERE `setores`.`ativo` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('nested $inner $using multiple $where', function () {

        sqlParams = {
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
                        ],
                        $where: {
                            ativo: 1
                        }
                    }
                ],
                $where: {
                    ativo: 1
                }
        };

        expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome` FROM `setores` INNER JOIN `unidades` USING(`id_unidade`) WHERE `setores`.`ativo` = \'1\' AND `unidades`.`ativo` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$field $dateFormat', function () {

        sqlParams = {
                $from : 'mi_itens',
                $fields : [
                    'id_mi_item',
                    {
                        $field: 'data',
                        $dateFormat : '%Y-%m-%d',
                        $as: 'data'
                    },
                ]
        };

        expectedResult = 'SELECT `mi_itens`.`id_mi_item`, DATE_FORMAT(`mi_itens`.`data`,\'%Y-%m-%d\') AS data FROM `mi_itens`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('$left $right $full $using', function () {

        sqlParams = {
                $from : 'setores',
                $fields : [
                    'id_setor',
                    'nome',
                    {
                        $left : 'unidades',
                        $using : 'id_unidade',
                        $fields : [
                            'id_unidade',
                            'nome'
                        ]
                    },
                    {
                        $right : 'usuarios',
                        $using : 'id_usuario',
                        $fields : [
                            'id_usuario',
                            'nome'
                        ]
                    },
                    {
                        $full : 'avioes',
                        $using : 'id_aviao',
                        $fields : [
                            'id_aviao',
                            'nome'
                        ]
                    }
                ]
        };

        expectedResult = 'SELECT `setores`.`id_setor`, `setores`.`nome`, `unidades`.`id_unidade`, `unidades`.`nome`, `usuarios`.`id_usuario`, `usuarios`.`nome`, `avioes`.`id_aviao`, `avioes`.`nome` FROM `setores` LEFT JOIN `unidades` USING(`id_unidade`) RIGHT JOIN `usuarios` USING(`id_usuario`) FULL JOIN `avioes` USING(`id_aviao`)';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

});






