/** @jsx React.DOM */

var Player = React.createClass({
  propTypes: {
    model: React.PropTypes.object
  },

  renderPopover: function() {
    return (
      <Popover title={this.props.model.name}>
        <button className="btn btn-warning">Challenge</button>
        <button className="btn btn-success">Report Game</button>
        <button className="btn btn-info">Profile</button>
      </Popover>
    )
  },

  render: function() {
    return (
      <OverlayTrigger trigger="click" placement="right" overlay={this.renderPopover()}>
        <div className="panel panel-player col-sm-2">
          <div className="avatar">
            <img src={this.props.model.avatar_url} className="img-responsive" />
          </div>
          <div className="player-name">
            {this.props.model.name}
          </div>
        </div>
      </OverlayTrigger>
    );
  }
});