/** @jsx React.DOM */

var TournamentRound = React.createClass({
  propTypes: {
    bracket: React.PropTypes.object.isRequired,
    round: React.PropTypes.number.isRequired,
    totalRounds: React.PropTypes.number,
  },

  findBrackets: function(currentBracket, currentRound) {
    if(currentBracket == undefined) {
      return [];
    }
    if(currentRound == (this.props.totalRounds - this.props.round - 1)) {
      return [currentBracket];
    }
    else {
      var left, right;
      left = [];
      right = [];
      if(currentBracket.left_bracket)
        left = this.findBrackets(currentBracket.left_bracket, currentRound + 1);
      if(currentBracket.right_bracket)
        right = this.findBrackets(currentBracket.right_bracket, currentRound + 1);
      return left.concat(right);
    }
  },

  renderBrackets: function() {
    var brackets = this.findBrackets(this.props.bracket, 0);

    if(_.isEmpty(brackets)) {
      return (
        <div className="final">
          <TournamentBracket bracket={this.props.bracket} finalGame={true} />
        </div>
      );

    }
    else {
      return _.map(brackets, function(bracket, index) {
        return (<TournamentBracket key={index} bracket={bracket} />);
      });
    }
  },

  render: function() {
    return (
      <div className={"bracket-" + (this.props.round)}>
        {this.renderBrackets(this.props.bracket, this.props.round)}
      </div>
    );
  }
});
