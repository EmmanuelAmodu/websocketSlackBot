var users = {};
function connnections(){

    this.addUser = function(token, connnection){
        if(connnection) this.users[token] = null;
        else this.user[token] = connnection;
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