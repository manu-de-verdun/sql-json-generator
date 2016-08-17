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


    it('simple select', function () {

        sqlParams = {
            $select: {
                $from: 'usuarios',
                $fields: [
                    'id_usuario',
                    'nome',
                    'sobrenome',
                    'login',
                    'admin'
                ]
            },
            $where: {
                login: 'admin',
                senha: '123456',
                ativo: 1
            }
        };

        expectedResult = 'SELECT `id_usuario`, `nome`, `sobrenome`, `login`, `admin` FROM `usuarios` WHERE `login` = \'admin\' AND `senha` = \'123456\' AND `ativo` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

});