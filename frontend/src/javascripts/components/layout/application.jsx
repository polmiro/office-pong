/** @jsx React.DOM */

var Application = React.createClass({
  render: function() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <SidebarNavigation>
              <SidebarNavigationItem
                title="Profile"
                icon="user"
                href={routeHelper.profilePath()}
              />
              <SidebarNavigationItem
               title="Players"
               icon="users"
               href={routeHelper.playersPath()}
              />
              <SidebarNavigationItem
                title="Tournaments"
                icon="trophy"
                href={routeHelper.tournamentsPath()}
              />
            </SidebarNavigation>
          </div>
          <div className="col-sm-9">
            <Locations>
              <Location path="/" handler={WelcomePage} />
              <Location path="/me" handler={Profile} />
              <Location path="/players" handler={PlayersList} />
              <Location path="/players/:id" handler={Profile} />
              <Location path="/tournaments" handler={TournamentsList} />
              <Location path="/tournaments/:id" handler={TournamentDetail} />
            </Locations>
          </div>
        </div>
      </div>
    );
  }
});