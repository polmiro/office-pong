window.PlayersService = function PlayersService(){};

PlayersService.prototype.loadPlayers = function(options) {
  $.ajax({
    url: "http://localhost:3000/api/v1/players",
    success: options.success,
    error: options.error
  });
};

