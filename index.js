module.exports = {

    update : function (data , callback) {

        // UPDATE
        var sql = "UPDATE `" + data.update + "`";

        // SET
        var setKeys = Object.keys(data.set);
        var setArray = [];

        setKeys.forEach( function (key) {
            setArray.push("`" + key + "` = '" + data.set[key] + "'");
        });

        sql +=  " SET " +  setArray.join(',');

        // WHERE
        var whereKeys = Object.keys(data.where);
        var whereArray = [];

        whereKeys.forEach( function (key) {
            whereArray.push("`" + key + "` = '" + data.where[key] + "'");
        });

        sql +=  " WHERE " +  whereArray.join(' AND ');

        callback( null , sql );
    }

};
