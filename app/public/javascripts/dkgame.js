var app = angular.module('dk', ['ngAudio']);

app.controller('MenuCtrl',function($scope,$rootScope){

  $scope.profile = function(name){
    console.log(name);
    $rootScope.$broadcast('profile',name);
  }

  $scope.$on('room',function(event,data){
    console.log('got data',data)
    $scope.room = data;
    console.log($scope.room.name);
    $scope.$apply();
  });

});

app.controller('ChangelogCtrl',function($scope,$rootScope){

  $scope.changelogs = [
    {
      "version": "3.0.2",
      "changes": [
        {
          "description":"La till flames i bakgrunden, kan gömmas i inställningar."
        },

      ]
    },
    {
      "version": "3.0.1",
      "changes": [
        {
          "description":"La till profiler (maila ante@dödskrök.se för att få er tillagd)"
        },
        {
          "description":"La till Changelog"
        },
        {
          "description":"La till versionnummer på spelet"
        },
      ]
    },
    {
      "version": "3.0.0",
      "changes": [
        {
          "description":"Ny design"
        },
        {
          "description":"Uppdaterade slumpgeneratorn till pilar från att färglägga list elementen."
        },
        {
          "description":"La till så man kan gömma menyn"
        },
        {
          "description":"Countdown timer tills nästa runda, visar hur lång tid det är tills nästa som minsta samt största. Tiden visas fortfarande inte tills nästa runda börjar."
        },
      ]
    }
  ]

});


app.controller('DkCtrl',function($scope,$interval,$timeout,ngAudio,$rootScope){
  $scope.io = {};
  $scope.io.socket = io();
  $scope.new_lobby = {};
  $scope.round = 0;
  $scope.playing = false;
  $scope.sound = ngAudio.load("sprit.mp3");
  $scope.lists = [];
  $scope.players = [];
  $scope.popup = {}
  $scope.startMin = 1;
  $scope.startMax = 4;
  $scope.popup.show = false;
  $scope.timeSinceLastRound = 0;
  $scope.hideMenu = false;
  setup();
  clock();

  /**
  * Returns all rooms from server
  */
  $scope.io.socket.on('rooms',function(data){
    console.log(data);
    $scope.io.rooms = data.rooms;
  });

  /**
  * When new room has been created
  */
  $scope.io.socket.on('room_created',function(data){
    console.log('room_created',data);
    if(data.success){
      connect_to_room(data.room);
    }
  });

  /**
  * On room connection
  */
  $scope.io.socket.on('room_connection',function(data){
    if(data.success){
      connect_to_room(data.room);
    }
  });
  $scope.io.socket.on('room_update',function(data){
    console.log("ROM_UPDATE", data);
    if(data.success){
      connect_to_room(data.room);
    }
  });
  function connect_to_room(room){
    $scope.room = room;
    $rootScope.blackout = false;
    $scope.popup.show = false;
    console.log("BROADCASTING!!");
    $rootScope.$broadcast('room',room);
  }

  $scope.startGame = function(){
    $scope.playing = true;
    $scope.sound.play();

    angular.forEach($scope.lists,function(list){
      list.index = Math.floor(Math.random() * $scope.players.length);
      rollList(list);
    });

    var checkMusic = $interval(function(){
      if(finishedPlaying()){
        $scope.playing = false;
        $scope.round += 1;
        $interval.cancel(checkMusic);
        randomizeNextRound();
      }
    },100);
  }

  function clock(){
    $interval(function(){
      $scope.timeSinceLastRound += 1000;
    },1000)
  }


  $scope.selected = function(index,listIndex){
    //console.log(index,listIndex);
    if($scope.playing)
    return;
    if(index == $scope.lists[listIndex].index)
    return 'active'
  }

  $scope.getMinTimeLeft = function(){
    var time = $scope.startMin*60 - ($scope.timeSinceLastRound/1000)
    if(time < 0){
      return 0;
    }
    return time;
  }

  $scope.getMaxTimeLeft = function(){
    var time = $scope.startMax*60 - ($scope.timeSinceLastRound/1000);
    if(time < 0){
      return 0;
    }
    return time;
  }

  $scope.removePlayer = function(player){
    $scope.players.splice([$scope.players.indexOf(player)],1);
  }
  $scope.removeList = function(list){
    $scope.lists.splice([$scope.lists.indexOf(list)],1);
  }

  $scope.addPlayerBox = function(){
    $rootScope.blackout = true;
    $scope.popup.show = true;
    $scope.popup.type = 'new-player';
  }
  $scope.newListItem = function(){
    if($scope.listitem != "" && $scope.listitem != undefined){
      $scope.lists.push({'title': $scope.listitem, 'index': -1});
      $scope.listitem = "";
    }
  }

  $scope.newPlayer = function(){
    if($scope.playername != "" && $scope.playername != undefined){
      $scope.players.push({'name': $scope.playername});
      $scope.playername = "";
    }
    $scope.closePopup();
  }

  $scope.showPopupHelp = function(){
    $rootScope.blackout = true;
    $scope.popup.show = true;
    $scope.popup.type = 'help';
  }
  $scope.showSettings = function(){
    $rootScope.blackout = true;
    $scope.popup.show = true;
    $scope.popup.type = 'settings';
  }
  $scope.closePopup = function(){
    $rootScope.blackout = false;
    $scope.popup.show = false;
  }
  function nextIndex(list,callback){
    list.index += 1;
    if(list.index > $scope.players.length-1){
      list.index = 0;
    }
    callback();
  }

  $scope.arrowPosition = function(list){
    var marginTop = -3;
    var titleHeight = 60;
    var itemHeight = 50;
    var pos = titleHeight + (itemHeight * list.index) + marginTop;
    if(!$scope.playing)
    pos += 10; //If not playing, add 10px beacuse of scale of transform
    return {'top': pos+'px'};
  }

  $scope.create_room = function(){
    $scope.io.socket.emit('create_room',{ room: $scope.new_lobby });
  }


  $scope.room_creation_disabled = function(){
    if($scope.new_lobby.lobby_name != undefined
      && $scope.new_lobby.name != undefined ){
      if($scope.new_lobby.lobby_name.length != 0
        && $scope.new_lobby.name.length != 0){
        return false;
      }
    }
    return true;
  }

  $scope.connect_to_room = function(room){
    $scope.io.socket.emit('connect_to_room',
    {
      room: room.id,
      user: $scope.new_lobby.name
    });
  }

  function rollList(list){
    if($scope.playing){
      $timeout(function(){
        nextIndex(list,function(){
          rollList(list);
        });
      },(randomTime(10,400)/1000));
    }
  }

  function finishedPlaying(){
    if($scope.sound.remaining <= 0.8){
      return true;
    }
    return false;
  }
  function randomizeNextRound(){
    var nextTime = randomTime($scope.startMin*60,$scope.startMax*60)
    $scope.timeSinceLastRound = 0;
    $timeout(function(){
      $scope.startGame();
    },nextTime);
  }

  /* Gets a random time between min and max in seconds */
  function randomTime(min,max)
  {
    return Math.floor(Math.random()*(max-min+1)+min) * 1000;
  }
  function setup(){
    $rootScope.blackout = true;
    $scope.popup.show = true;
    $scope.popup.type = 'lobby';
    $scope.io.socket.emit('get_rooms');
    populateLists();
    populateSTABEN();
  }
  $scope.$on('profile',function(event,data){
    if(data == 'staben'){
      populateSTABEN()
    }
    else if(data == 'dgroup'){
      populateDGROUP();
    }
    else if(data == 'cc'){
      populateCC();
    }
    else if(data == '720'){
      populate720();
    }
  });
  function populateSTABEN(){
    $scope.players = []
    $scope.players.push({'name':"General"});
    $scope.players.push({'name':"Öl & Bar"});
    $scope.players.push({'name':"Fadderansvarig"});
    $scope.players.push({'name':"Spons"});
    $scope.players.push({'name':"Biljett"});
    $scope.players.push({'name':"Ljus & Ljus"});
    $scope.players.push({'name':"Gückel"});
    $scope.players.push({'name':"Kassör"});
    $scope.players.push({'name':"Tryck"});
    $scope.players.push({'name':"Werk"});
    $scope.players.push({'name':"Bokning"});
    $scope.players.push({'name':"Nollegrupp"});
    $scope.players.push({'name':"Mat"});
    $scope.players.push({'name':"Webb"});
  }
  function populateCC(){
    $scope.players = []
    $scope.players.push({'name':"Chef"});
    $scope.players.push({'name':"Spons"});
    $scope.players.push({'name':"Dryck"});
    $scope.players.push({'name':"Klipp und Klister"});
    $scope.players.push({'name':"Biljett"});
    $scope.players.push({'name':"PR"});
    $scope.players.push({'name':"Kassör"});
    $scope.players.push({'name':"Tryck"});
    $scope.players.push({'name':"Klipp und Klister"});
    $scope.players.push({'name':"Mat"});
    $scope.players.push({'name':"Intendent"});
    $scope.players.push({'name':"Personal"});
  }
  function populateDGROUP(){
    $scope.players = []
    $scope.players.push({'name':"Fluffet"});
    $scope.players.push({'name':"Chief"});
    $scope.players.push({'name':"Spokk"});
    $scope.players.push({'name':"Öl & Bar"});
    $scope.players.push({'name':"Event"});
    $scope.players.push({'name':"Spons"});
    $scope.players.push({'name':"J^8"});
    $scope.players.push({'name':"Kassör"});
    $scope.players.push({'name':"Tryck"});
    $scope.players.push({'name':"Werk"});
    $scope.players.push({'name':"Bokning"});
    $scope.players.push({'name':"Mat"});
    $scope.players.push({'name':"Webb"});
  }
  function populate720(){
    $scope.players = []
    $scope.players.push({'name':"Ordförande"});
    $scope.players.push({'name':"Vice Ordförande"});
    $scope.players.push({'name':"Kassör"});
    $scope.players.push({'name':"Reseansvarig"});
    $scope.players.push({'name':"Eventansvarig"});
    $scope.players.push({'name':"Spons 1"});
    $scope.players.push({'name':"Spons 2"});
    $scope.players.push({'name':"PR/Info"});
    $scope.players.push({'name':"Web/Foto/Film"});
    $scope.players.push({'name':"Tryck"});
  }
  function populateLists(){
    $scope.lists.push({'title':"Ta 5 klunkar", index: -1});
    $scope.lists.push({'title':"Ge bort 5 klunkar", index: -1});
    $scope.lists.push({'title':"Svep en öl", index: -1});
  }
});