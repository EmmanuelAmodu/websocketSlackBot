var user = {};
function connnections(){

    this.addUser = function(token, connection){
        user.token = connection;
    }

    this.getUser = function(token){
        return users.token
    }

    this.getAllUser = function(){
        return users;
    }

    this.deleteUser = function(token){
        delete users.token;
    }
}

module.exports = new connnections();
