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


    it('simple field  select', function () {

        sqlParams = {
            $select : {
                $from : 'table1',
                $fields : [
                    'field_a'
                ]
            },
            $where : {
                field_d: 1
            }
        };

        expectedResult = 'SELECT `table1`.`field_a` FROM `table1` WHERE `field_d` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('multiple fields select', function () {

        sqlParams = {
            $select : {
                $from : 'table1',
                $fields : [
                    'field_a',
                    {
                        $field : 'field_b',
                        $as : 'newFieldName'
                    },
                    'field_c'
                ]
            },
            $where : {
                field_d: 1
            }
        };

        expectedResult = 'SELECT `table1`.`field_a`, `table1`.`field_b` AS newFieldName, `table1`.`field_c` FROM `table1` WHERE `field_d` = \'1\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });


    it('multiple wrapped fields select', function () {

        sqlParams = {
            $select : {
                $from: 'table1',
                $fields: [
                    {
                        $field: 'column_a'
                    },
                    {
                        $field: 'column_b'
                    },
                ]
            }
        };

        expectedResult = 'SELECT `table1`.`column_a`, `table1`.`column_b` FROM `table1`';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

});






