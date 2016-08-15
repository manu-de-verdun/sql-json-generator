var test = function () {

    var whereBuilder = function (conditions, callback) {

        var whereKeys = Object.keys(conditions);
        var whereArray = [];
        var whereExpression = " WHERE ";

        whereKeys.forEach(function (key) {
            whereArray.push("`" + key + "` = '" + conditions[key] + "'");
        });

        whereExpression += whereArray.join(' AND ');

        return callback( null , whereExpression);
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

        whereBuilder ( data.where , function ( err, result ) {

            if (err) return callback ( err, null);

            sql += result;

            callback(null, sql);


        } );

    }

}


module.exports = test;
