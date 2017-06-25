var dbconn = require('./dbconn.js');
dropTable("onlineUsers");
function dropTable(table){
    dbconn.dropTable(table);
}
