/** @jsx React.DOM */

var SidebarNavigation = React.createClass({
  render: function() {
    return (
      <ul className="nav nav-pills nav-stacked nav-main">
        {this.props.children}
      </ul>
    );
  }
});