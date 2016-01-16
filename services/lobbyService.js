var activeLobbies = [];
var idCounter = 1;
module.exports = {

    createLobby: function(name, playerList, password) {
        var lobbyObj = {
            'id': idCounter;
            'name': name,
            'players': playerList,
            'password': password
        };
        idCounter += 1;
        activeLobbies.push(lobbyObj);
    }

    removeLobby
};