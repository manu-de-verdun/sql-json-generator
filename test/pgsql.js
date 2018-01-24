var should = require('chai').should();
var expect = require('chai').expect;

var SQLGenerator = require('../index');

describe('#pgSQL - SELECT', function () {

    var sqlGenerator = new SQLGenerator({ pgSQL: true });
    var sqlParams;

    it('query #01', function () {

        sqlParams = {
            $from: 'iab_cidadao',
            $fields: [,
                'nr_cartao_sus',
                {
                    $inner: 'grl_pessoa',
                    $on: {
                        $parent: 'cd_cidadao',
                        $child: 'cd_pessoa'
                    },
                    $fields: [
                        'nm_pessoa'
                    ],
                    $where: [{
                        $field: 'nm_pessoa',
                        $like: '%EMMA%'
                    }]
                }
            ],
            $where: [],
            $order: [{
                $field: 'nm_pessoa',
                $table: 'grl_pessoa',
            }]
        };

        var expectedResult = 'SELECT iab_cidadao.nr_cartao_sus, grl_pessoa.nm_pessoa FROM iab_cidadao INNER JOIN grl_pessoa ON iab_cidadao.cd_cidadao = grl_pessoa.cd_pessoa WHERE grl_pessoa.nm_pessoa LIKE \'%EMMA%\' ORDER BY grl_pessoa.nm_pessoa';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);

    });

    it('query #02', function () {

        sqlParams = {
            $from: 'iab_cidadao',
            $fields: [,
                'nr_cartao_sus',
                {
                    $inner: 'grl_pessoa',
                    $on: {
                        $parent: 'cd_cidadao',
                        $child: 'cd_pessoa'
                    },
                    $fields: [
                        'nm_pessoa'
                    ]
                }
            ],
            $where: [],
            $order: [{
                $field: 'nm_pessoa',
                $table: 'grl_pessoa',
            }],
            $limit : {
                $offset: 0,
                $rows: 10
            }
        };

        var expectedResult = 'SELECT iab_cidadao.nr_cartao_sus, grl_pessoa.nm_pessoa FROM iab_cidadao INNER JOIN grl_pessoa ON iab_cidadao.cd_cidadao = grl_pessoa.cd_pessoa ORDER BY grl_pessoa.nm_pessoa LIMIT 10 OFFSET 0';

        sqlGenerator.select(sqlParams).should.equal(expectedResult);

    });
});
