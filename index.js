var test = function () {

    var whereBuilder = function (conditions, operador) {

        var whereKeys = Object.keys(conditions);
        var whereArray = [];
        var whereExpression = "";

        console.log('');
        console.log('whereBuilder');
        console.log('  operador: ' , operador);
        console.log('  conditions: ', conditions);


        whereKeys.forEach(function (key) {

            switch (key) {

                case "$gt" :
                        whereArray.push(whereBuilder(conditions[key], '$gt'));
                    break;

                default:

                    switch (operador) {

                        case '$gt':
                            whereArray.push("`" + key + "` > '" + conditions[key] + "'");
                            break;

                        default:
                            whereArray.push("`" + key + "` = '" + conditions[key] + "'");
                    }
            }
        });

        whereExpression += whereArray.join(' AND ');

        return whereExpression;
    };


    this.update = function (data, callback) {

        // UPDATE
        var sql = "UPDATE `" + data.update + "`";

        // SET
        var setKeys = Object.keys(data.set);
        var setArray = [];

        setKeys.forEach(function (key) {
            setArray.push("`" + key + "` = '" + data.set[key] + "'");
        });

        sql += " SET " + setArray.join(',');

        sql += " WHERE " + whereBuilder(data.where, null);

        return sql;

    }

}


module.exports = test;
