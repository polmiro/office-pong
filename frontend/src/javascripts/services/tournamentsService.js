window.TournamentsService = function TournamentsService(){};

TournamentsService.prototype.loadTournament = function(id, options) {
  $.ajax({
    url: "http://localhost:3000/api/v1/tournaments/" + id,
    success: options.success,
    error: options.error
  });
};

TournamentsService.prototype.loadTournaments = function(options) {
  $.ajax({
    url: "http://localhost:3000/api/v1/tournaments",
    success: options.success,
    error: options.error
  });
};

