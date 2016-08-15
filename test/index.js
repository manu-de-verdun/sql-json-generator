var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#update', function() {

    var sqlGenerator = new SQLGenerator();
    var sqlParams;

    it('simple update', function() {

        sqlParams = {
            update: 'mytable',
            set : {
                field_b: 1
            },
            where: {
                field_a: 1
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_b` = \'1\' WHERE `field_a` = \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);

    });

    it('double field update', function() {

        sqlParams = {
            update: 'mytable',
            set : {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: 1
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` = \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);

    });



    it('double field update with to where params', function() {

        sqlParams = {
            update: 'mytable',
            set : {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: 1,
                field_b: 1
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` = \'1\' AND `field_b` = \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

    it('simple $gt', function() {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $gt: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` > \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });


    it('double $gt', function() {

        sqlParams = {
            update: 'mytable',
            set: {
                field_c: 1,
                field_d: 1
            },
            where: {
                field_a: {
                    $gt: 1
                },
                field_b: {
                    $gt: 1
                }
            }
        };

        expectedResult = 'UPDATE `mytable` SET `field_c` = \'1\',`field_d` = \'1\' WHERE `field_a` > \'1\' AND `field_b` > \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedResult);
    });

});
