window.ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

window.Locations  = ReactRouter.Locations;
window.Location = ReactRouter.Location;
window.Link = ReactRouter.Link;
window.NotFound = ReactRouter.NotFound;

window.Button  = ReactBootstrap.Button;
window.OverlayTrigger  = ReactBootstrap.OverlayTrigger;
window.Modal  = ReactBootstrap.Modal;
window.Popover  = ReactBootstrap.Popover;
window.Jumbotron  = ReactBootstrap.Jumbotron;
window.Label  = ReactBootstrap.Label;

window.routeHelper = new RouteHelper();

window.services = {
  players: new PlayersService(),
  tournaments: new TournamentsService()
};

