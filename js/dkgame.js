var app = angular.module('dk', ['ngAudio']);

app.controller('MenuCtrl',function($scope,$rootScope){

  $scope.profile = function(name){
    $rootScope.$broadcast('profile',name);
  }

});

app.controller('ChangelogCtrl',function($scope,$rootScope){

  $scope.changelogs = [
      {
      "version": "3.0.2",
      "changes": [
        {
          "description":"La till flames i bakgrunden, kan g�mmas i inst�llningar."
        },

      ]
    },
    {
      "version": "3.0.1",
      "changes": [
        {
          "description":"La till profiler (maila ante@d�dskr�k.se f�r att f� er tillagd)"
        },
        {
          "description":"La till Changelog"
        },
        {
          "description":"La till versionnummer p� spelet"
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
          "description":"Uppdaterade slumpgeneratorn till pilar fr�n att f�rgl�gga list elementen."
        },
        {
          "description":"La till s� man kan g�mma menyn"
        },
        {
          "description":"Countdown timer tills n�sta runda, visar hur l�ng tid det �r tills n�sta som minsta samt st�rsta. Tiden visas fortfarande inte tills n�sta runda b�rjar."
        },
      ]
    }
  ]

});


app.controller('DkCtrl',function($scope,$interval,$timeout,ngAudio,$rootScope){

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
    return {'top': pos+'px'};
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
      $scope.players.push({'name':"�l & Bar"});
      $scope.players.push({'name':"Fadderansvarig"});
      $scope.players.push({'name':"Spons"});
      $scope.players.push({'name':"Biljett"});
      $scope.players.push({'name':"Ljus & Ljus"});
      $scope.players.push({'name':"G�ckel"});
      $scope.players.push({'name':"Kass�r"});
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
      $scope.players.push({'name':"Kass�r"});
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
      $scope.players.push({'name':"�l & Bar"});
      $scope.players.push({'name':"Event"});
      $scope.players.push({'name':"Spons"});
      $scope.players.push({'name':"J^8"});
      $scope.players.push({'name':"Kass�r"});
      $scope.players.push({'name':"Tryck"});
      $scope.players.push({'name':"Werk"});
      $scope.players.push({'name':"Bokning"});
      $scope.players.push({'name':"Mat"});
      $scope.players.push({'name':"Webb"});
    }
  function populate720(){
      $scope.players = []
      $scope.players.push({'name':"Ordf�rande"});
      $scope.players.push({'name':"Vice Ordf�rande"});
      $scope.players.push({'name':"Kass�r"});
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
      $scope.lists.push({'title':"Svep en �l", index: -1});
      $scope.lists.push({'title':"Ta 1 Shot", index: -1});
    }
});
