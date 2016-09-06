var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#insert - json errors', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;

    it('call without params', function () {

        expect(sqlGenerator.insert()).to.be.null;

    });


    it('call with missing $insert', function () {

        sqlParams = {
            $values: {
                arquivado: 0,
                arquivado_codigo: ''
            }
        };

        expect(sqlGenerator.insert(sqlParams)).to.be.null;

    });

    it('call with missing $values', function () {

        sqlParams = {
            $insert: 'table1'
        };

        expect(sqlGenerator.insert(sqlParams)).to.be.null;

    });


});

describe('#insert - queries', function () {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;

    it('simple insert', function () {

        sqlParams = {
            $insert: 'table_1',
            $values: {
                field_a: 1
            }
        };

        var expectedResult = 'INSERT INTO `table_1` (`field_a`) VALUES (\'1\')';

        sqlGenerator.insert(sqlParams).should.equal(expectedResult);

    });

    it('several fields', function () {

        sqlParams = {
            $insert: 'mi_itens_inventarios',
            $values: {
                id_modelo_insumo: 2301,
                folha: 'ZZ',
                quantidade: 1500,
                lote: 'ABCD7F',
                validade: '2019-12-12',
                id_usuario: 3
            }
        };

        var expectedResult = 'INSERT INTO `mi_itens_inventarios` (`id_modelo_insumo`,`folha`,`quantidade`,`lote`,`validade`,`id_usuario`) VALUES (\'2301\',\'ZZ\',\'1500\',\'ABCD7F\',\'2019-12-12\',\'3\')';

        sqlGenerator.insert(sqlParams).should.equal(expectedResult);

    });
});