var test = function () {

    var whereBuilder = function (conditions, parentKey) {

        var whereKeys = Object.keys(conditions);
        var whereArray = [];
        var whereExpression = "";

        console.log('');
        console.log('whereBuilder');
        console.log('  conditions: ', conditions);
        console.log('  parentKey: ' , parentKey);


        whereKeys.forEach(function (key) {

            if ( typeof conditions[key] === 'object') {
                whereArray.push(whereBuilder(conditions[key] , key ));
            }

            else {
                switch (key) {

                    case "$gt" :
                        whereArray.push("`" + parentKey + "` > '" + conditions[key] + "'");
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
