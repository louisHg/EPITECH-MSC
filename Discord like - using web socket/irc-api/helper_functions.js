const users = [];

function addUser(id,username,channel_id){
    var user = {"id": id, "username" : username, "channel_id":channel_id}
    users.push(user)
    return user
}
function changeUsername(id,username){
    for(let i = 0 ; i < users.length ; i++){
        if(id === users[i].id){
            users[i].username = username;
        }
    }
}

function removeUser(id){
    for(let i  = 0; i < users.length;i++){
        if(users[i].id == id){
            var user = users[i]
            users.splice(i,1)
        }
    }
    return user
}
function getUser(id){
    return users.find((user)=>user.id === id)
}
function getAllUsers(channel_id){
    return users.filter((user)=> user.channel_id === channel_id)
}


module.exports = { addUser,removeUser,getAllUsers,getUser,changeUsername}