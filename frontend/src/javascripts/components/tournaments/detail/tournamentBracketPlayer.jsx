/** @jsx React.DOM */

var TournamentBracketPlayer = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired
  },

  render: function() {
    if(this.props.player) {
      return (
        <div className="tournament-player">
          <Button block>{this.props.player.name}</Button>
        </div>
      );
    }
    else {
      return <div/>;
    }
  }
});