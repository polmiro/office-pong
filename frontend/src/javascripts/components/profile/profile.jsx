/** @jsx React.DOM */

var Profile = React.createClass({
  getInitialState: function() {
    return { player: {} }
  },

  componentWillMount: function() {
    services.players.loadPlayer(1, {
      success: function (response) {
        this.setState({ player: response.data });
      }.bind(this),
      error: function() {
        alert("oops;");
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div>
        Hello {this.player.name}!
      </div>
    );
  }
});