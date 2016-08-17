var sqlJsonGenerator = function () {

    /**
     * Building SQL WHERE conditions
     * @param conditions
     * @param parentKey
     * @returns {string}
     */
    var whereBuilder = function (conditions, parentKey) {

        var whereKeys = Object.keys(conditions);
        var whereArray = [];
        var whereExpression = "";

        //console.log('');
        //console.log('whereBuilder');
        //console.log('  conditions: ', conditions);
        //console.log('  parentKey: ' , parentKey);


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

    /**
     * Building SELECT expression
     * @param conditions
     * @param parentKey
     */
    var selectBuilder = function (conditions, parentKey) {

        console.log('');
        console.log('selectBuilder');
        console.log('  conditions: ', conditions);
        console.log('  parentKey: ' , parentKey);

        var currentTable;
        var selectKeys = Object.keys(conditions);
        var selectObject = {
            select : [],
            from: []
        };


        if ( selectKeys.indexOf('$from') >= 0 ) {
            currentTable = conditions['$from'];
            selectObject.from.push("FROM `" + currentTable + "`");
        }

        conditions['$fields'].forEach( function ( field ) {
            selectObject.select.push("`" + currentTable + "`.`" + field + "`");
        });

        return selectObject
    };

    /**
     * Generate an UPDATE command based on params
     * @param queryParams
     * @returns {string} SQL Query
     */
    this.update = function (queryParams) {

        // test if required query params are provided
        if ( !queryParams || !queryParams.$update || !queryParams.$set) return null;

        // UPDATE
        var sql = "UPDATE `" + queryParams.$update + "`";

        // SET
        var setKeys = Object.keys(queryParams.$set);
        var setArray = [];

        setKeys.forEach(function (key) {
            setArray.push("`" + key + "` = '" + queryParams.$set[key] + "'");
        });

        sql += " SET " + setArray.join(',');

        if ( queryParams.$where ) {
            sql += " WHERE " + whereBuilder(queryParams.$where, null);
        }

        return sql;

    };


    /**
     * Generate an INSERT command based on params
     * @param queryParams
     * @returns {string} SQL Query
     */
    this.insert = function (queryParams, callback) {

        // test if required query params are provided
        if ( !queryParams || !queryParams.$insert || !queryParams.$values) return null;

        // INSERT
        var sql = "INSERT INTO `" + queryParams.$insert + "`";

        // KEYS
        var setKeys = Object.keys(queryParams.$values);

        var keysArray = [];
        setKeys.forEach(function (key) {
            keysArray.push("`" + key + "`");
        });

        sql += " (" + keysArray.join(',') + ")" ;

        // Values

        var valuesArray = [];
        setKeys.forEach(function (key) {
            valuesArray.push("'" + queryParams.$values[key] + "'");
        });

        sql += " VALUES (" + valuesArray.join(',') + ")" ;

        return sql;

    };


    /**
     * Generate an UPDATE command based on params
     * @param queryParams
     * @returns {string} SQL Query
     */
    this.delete = function (queryParams, callback) {

        // test if required query params are provided
        if ( !queryParams || !queryParams.$delete ) return null;

        // DELETE
        var sql = "DELETE FROM `" + queryParams.$delete + "`";

        if ( queryParams.$where ) {
            sql += " WHERE " + whereBuilder(queryParams.$where, null);
        }

        return sql;

    };


    /**
     * Generate an SELECT command based on params
     * @param queryParams
     * @returns {string} SQL Query
     */
    this.select = function (queryParams, callback) {

        // test if required query params are provided
        if ( !queryParams || !queryParams.$select  ) return null;

        // SELECT
        var sql = "SELECT";
        var selectObject= selectBuilder( queryParams.$select );

        sql += " " + selectObject.select.join(', ');
        sql += " " + selectObject.from.join(', ');

        // WHERE
        if ( queryParams.$where ) {
            sql += " WHERE " + whereBuilder(queryParams.$where, null);
        }

        return sql;

    };

};


module.exports = sqlJsonGenerator;
