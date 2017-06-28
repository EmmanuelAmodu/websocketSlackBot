//db connection code
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

function dbconnect(){
    this.dbUrl = "mongodb://localhost:27017/websocket";

    this.createDB = function(){
        MongoClient.connect(this.dbUrl, function(err, db) {
            //if (err) throw err;
            console.log("DB created!");
            db.close();
        });
    }

    this.createCollection = function(name){
        MongoClient.connect(this.dbUrl, function(err, db) {
            db.createCollection(name, function(err, res) {
                //if (err) throw err;
                console.log("Table created!");
                db.close();
            });
        });
    }

    this.insertToCollection = function(table, data){
        MongoClient.connect(this.dbUrl, function(err, db) {
            //if (err) throw err;
            console.log(table);
            db.collection(table).insert(data);
            console.log("data inserted!");
            db.close();
        });
    }

    this.readCollections = function(table, data, callback){
        MongoClient.connect(this.dbUrl, function(err, db) {
            db.collection(table).findOne(data, function(err, res) {
                callback(res);
                db.close();
            });
        });
    }

    this.ifCollectionExist = function(table, exist, deosNotExist){
        MongoClient.connect(this.dbUrl, function(err, db) {
            db.listCollections().toArray(function(err, collInfos) {

                var collInfosName = [];
                collInfos.forEach(function(el) {
                    collInfosName.push(el.name);
                }, this);

                if (collInfosName.indexOf(table) == -1) {
                    console.log("table does not exist");
                    deosNotExist(table);
                } else {
                    console.log("table exist");
                    exist(table);
                }
                db.close();
            });
        });
    }

    this.dropTable = function(table){
        MongoClient.connect(this.dbUrl, function(err, db) {
            if (err) throw err;
            db.dropCollection(table, function(err, delOK) {
                if (err) throw err;
                if (delOK) console.log("Table deleted ", table);
                db.close();
            });
        });
    }

    this.isTableEmpty = function(table, callback){
        var result = false;
        MongoClient.connect(this.dbUrl, function(err, db) {
            db.collection(table).count({}, function(err, res){
                if(!res) callback(table);
                db.close();
            });
        });
    }

    this.deleteColumn = function(table, data, callback){
        MongoClient.connect(this.dbUrl, function(err, db) {
            db.collection(table).findOneAndDelete(data, function(err, res){
                 if(res !== null) callback();
            });
        });
    }

    this.update = function(table, data, newData, callback){
        MongoClient.connect(this.dbUrl, function(err, db) {
            db.connect(table).update(data, newData, function(err, res){
                callback();
            });
        });
    }
}

module.exports = new dbconnect();