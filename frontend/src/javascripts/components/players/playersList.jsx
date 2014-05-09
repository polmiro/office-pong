/** @jsx React.DOM */

var PlayersList = React.createClass({
  getInitialState: function() {
    return { players: [] }
  },

  componentWillMount: function() {
    services.players.loadPlayers({
      success: function (response) {
        this.setState({ players: response });
      }.bind(this),
      error: function() {
        alert("oops;");
      }.bind(this)
    });
  },

  renderPlayers: function() {
    return $.map(this.state.players, function(player, index) {
      return <Player key={index} player={player} />
    });
  },
  render: function() {
    return (
      <div>
        {this.renderPlayers()}
      </div>
    );
  }
});