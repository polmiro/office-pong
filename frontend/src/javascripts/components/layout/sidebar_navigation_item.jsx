/** @jsx React.DOM */

var SidebarNavigationItem = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
    active: React.PropTypes.bool.isRequired
  },

  classes: function() {
    return React.addons.classSet({
      active: this.props.active
    });
  },

  render: function() {
    return (
      <li className={this.classes()}>
        <a href="#">
          <div className="nav-item-icon">
            <i className={"fa fa-" + this.props.icon + " fa-2x"} />
          </div>
          <div className="nav-item-title">
            {this.props.title}
          </div>
        </a>
      </li>
    )
  }
});