var should = require('chai').should(),
    sqlGenerator = require('../index')

describe('#update', function() {

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
        }

        expectedOutput = 'UPDATE `mytable` SET `field_b` = \'1\' WHERE `field_a` = \'1\'';

        sqlGenerator.update(sqlParams).should.equal(expectedOutput);

    });

    
});
