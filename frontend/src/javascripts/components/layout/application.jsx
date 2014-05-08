/** @jsx React.DOM */

var Application = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <SidebarNavigation>
              <SidebarNavigationItem title="Players" icon="users" active={true} />
              <SidebarNavigationItem title="Profile" icon="user" active={false} />
              <SidebarNavigationItem title="Tournament" icon="trophy" active={false} />
            </SidebarNavigation>
          </div>
          <div className="col-sm-9">
            <PlayersList />
          </div>
        </div>
      </div>
    );
  }
});