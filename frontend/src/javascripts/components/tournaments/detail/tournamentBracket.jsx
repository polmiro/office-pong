/** @jsx React.DOM */

var TournamentBracket = React.createClass({
  propTypes: {
    bracket: React.PropTypes.object.isRequired,
    finalGame: React.PropTypes.bool
  },

  leftPlayer: function() {
    if(this.props.bracket.game)
      return this.props.bracket.game.pairing.players[0];
    else if(this.props.bracket.left_bracket)
      return this.props.bracket.left_bracket.winner;
    else
      return null;
  },

  rightPlayer: function() {
    if(this.props.bracket.game)
      return this.props.bracket.game.pairing.players[1];
    else if(this.props.bracket.right_bracket)
      return this.props.bracket.right_bracket.winner;
    else
      return null;
  },

  renderGame: function() {
    return (
      <div className="bracket-box">
        <span className="player1">
          <TournamentBracketPlayer player={this.leftPlayer()} />
        </span>
        <span className="player2">
          <TournamentBracketPlayer player={this.rightPlayer()} />
        </span>
      </div>
    );
  },

  renderFinalGame: function() {
    return (
      <div className="bracket-box">
        <span className="player3">
          <TournamentBracketPlayer player={this.props.bracket.winner} />
        </span>
      </div>
    );
  },

  render: function() {
    if(this.props.finalGame) {
      return this.renderFinalGame();
    }
    else {
      return this.renderGame();
    }
  }
});