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

            // Logical AND
            if ( key === "$and" ) {

                var andArray = [];

                conditions[key].forEach( function ( element ) {
                    andArray.push(whereBuilder(element , null ));
                });

                whereArray.push( "(" + andArray.join(' AND ') + ")");

            }

            //Logical OR
            else if ( key === "$or" ) {

                var andArray = [];

                conditions[key].forEach( function ( element ) {
                    andArray.push(whereBuilder(element , null ));
                });

                whereArray.push( "(" + andArray.join(' OR ') + ")");
            }

            // Nested Object (not part of a logical operation)
            else if ( typeof conditions[key] === 'object') {
                whereArray.push(whereBuilder(conditions[key] , key ));
            }

            // Comparaison Operators
            else {
                switch (key) {

                    case "$gt" :
                        whereArray.push("`" + parentKey + "` > '" + conditions[key] + "'");
                        break;

                    case "$gte" :
                        whereArray.push("`" + parentKey + "` >= '" + conditions[key] + "'");
                        break;

                    case "$lt" :
                        whereArray.push("`" + parentKey + "` < '" + conditions[key] + "'");
                        break;

                    case "$lte" :
                        whereArray.push("`" + parentKey + "` <= '" + conditions[key] + "'");
                        break;

                    case "$eq" :
                        whereArray.push("`" + parentKey + "` = '" + conditions[key] + "'");
                        break;

                    case "$ne" :
                        whereArray.push("`" + parentKey + "` <> '" + conditions[key] + "'");
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
