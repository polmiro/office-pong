/** @jsx React.DOM */

var Player = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired
  },

  renderPopover: function() {
    return (
      <Popover title={this.props.player.name}>
        <Button bsStyle="warning" block>Challenge</Button>
        <Button bsStyle="success" block>Report Game</Button>
        <Button bsStyle="info" href={routeHelper.playerPath(this.props.player.id)} block>Profile</Button>
      </Popover>
    )
  },

  render: function() {
    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={this.renderPopover()}>
        <div className="panel panel-player col-sm-2">
          <div className="avatar">
            <img src={this.props.player.avatar_url} className="img-responsive" />
          </div>
        </div>
      </OverlayTrigger>
    );
  }
});