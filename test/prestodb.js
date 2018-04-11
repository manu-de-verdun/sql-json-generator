var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#prestoDB - SELECT', function () {

    var sqlGenerator = new SQLGenerator({ prestoDB: true });
    var sqlParams;

    it('query #01', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                field_a: 1
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a = 1';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #02', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                $field: "field_a",
                $gte: 100
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a >= 100';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #03', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                $field: "field_a",
                $lt: 10.55
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a < 10.55';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #04', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [{
                $field: "field_a",
                $like: '%test%'
            }]
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 WHERE table1.field_a LIKE \'%test%\'';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });

    it('query #04', function () {

        sqlParams = {
            $from: 'table1',
            $fields: ['field_a'],
            $where: [],
            $limit: {
                $offset: 0,
                $rows: 10
            }
        };

        var expectedResult = 'SELECT table1.field_a FROM table1 LIMIT 10';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);
    });
});