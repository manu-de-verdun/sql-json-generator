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
    var joinBuilder = function (joinData ) {

        var sqlJoin ='';

        var joinKeys = Object.keys(joinData);

        if ( joinKeys.indexOf('$inner') >= 0 ) {
                sqlJoin += 'INNER JOIN `' + joinData['$inner'] + '` ';
        }

        if ( joinKeys.indexOf('$using') >= 0 ) {
            sqlJoin += 'USING(`' + joinData['$using'] + '`)';
        }

        return sqlJoin;

    };

    var selectBuilder = function (conditions) {

        //console.log('');
        //console.log('selectBuilder');
        //console.log('  conditions: ', conditions);


        var currentTable;
        var selectKeys = Object.keys(conditions);
        var selectObject = {
            select : [],
            from: [],
            where: []
        };

        // Tests the conditions object keys to see what action is required (from, join, etc...)
        if ( selectKeys.indexOf('$from') >= 0 ) {
            currentTable = conditions['$from'];
            selectObject.from.push("FROM `" + currentTable + "`");
        }

        if ( selectKeys.indexOf('$inner') >= 0 ) {
            currentTable = conditions['$inner'];
            selectObject.from.push( joinBuilder(conditions ));
        }

        // WHERE
        if ( selectKeys.indexOf('$where') >= 0 ) {
            selectObject.where.push( whereBuilder(conditions['$where'], null));
        }

        // Process all provided fields
        conditions['$fields'].forEach( function ( field ) {


            if ( typeof field === 'object')  {

                var currentField = {};

                // if it is an object, analyze it
                var fieldKeys = Object.keys(field);

                // If it is a special operation that needs recursive call ( $inner, $left, $right )
                if ( fieldKeys.indexOf('$inner')>= 0 ) {
                    var recursiveSelectObject = selectBuilder( field );
                    recursiveSelectObject.select.forEach( function ( item ) {
                        selectObject.select.push(item);
                    });
                    recursiveSelectObject.from.forEach( function ( item ) {
                        selectObject.from.push(item);
                    });
                }
                else {
                    if ( fieldKeys.indexOf('$field')>= 0 ) {
                        currentField.name = field['$field'];
                    }

                    if ( fieldKeys.indexOf('$as')>= 0 ) {
                        currentField.as = field['$as'];
                    }

                    currentField.sql = "`" + currentTable + "`.`" + currentField.name + "`";
                    currentField.sql += (currentField.as) ? " AS " + currentField.as : '';
                    selectObject.select.push( currentField.sql );
                }
            }
            else {
                // raw field, add it to the select Object
                selectObject.select.push("`" + currentTable + "`.`" + field + "`");
            }

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
        var sql = "";
        var selectObject= selectBuilder( queryParams.$select );

        sql += "SELECT " + selectObject.select.join(', ');
        sql += " " + selectObject.from.join(' ');
        sql += " WHERE " + selectObject.where.join('AND ');

        return sql;

    };

};


module.exports = sqlJsonGenerator;
