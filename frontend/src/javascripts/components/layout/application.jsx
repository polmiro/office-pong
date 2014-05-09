/** @jsx React.DOM */

var Application = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <SidebarNavigation>
              <SidebarNavigationItem
               title="Players"
               icon="users"
               href={routeHelper.playersPath()}
              />
              <SidebarNavigationItem
                title="Profile"
                icon="user"
                href={routeHelper.profilePath()}
              />
              <SidebarNavigationItem
                title="Tournament"
                icon="trophy"
                href={routeHelper.tournamentsPath()}
              />
            </SidebarNavigation>
          </div>
          <div className="col-sm-9">
            <Locations>
              <Location path="/" handler={WelcomePage} />
              <Location path="/players" handler={PlayersList} />
              <Location path="/me" handler={Profile} />
              <Location path="/tournaments" handler={TournamentsList} />
            </Locations>
          </div>
        </div>
      </div>
    );
  }
});