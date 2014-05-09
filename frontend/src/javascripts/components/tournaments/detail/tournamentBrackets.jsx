/** @jsx React.DOM */

var TournamentBrackets = React.createClass({
  propTypes: {
    bracket: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return { totalRounds: this.calculateTotalRounds(this.props.bracket) }
  },

  calculateTotalRounds: function(bracket) {
    var left, right;
    left = 1;
    right = 1;
    if(bracket.left_bracket)
      left = this.calculateTotalRounds(bracket.left_bracket);
    if(bracket.right_bracket)
      right = this.calculateTotalRounds(bracket.right_bracket);
    return 1 + Math.max(left, right);
  },

  renderRounds: function() {
    return _.tap([], function(rounds) {
      _.times(this.props.totalRounds, function(round) {
        rounds.push(
          <TournamentRound key={round+1} bracket={this.props.bracket} round={round+1} totalRounds={this.props.totalRounds} />);
      }.bind(this));
    }.bind(this));
  },

  render: function() {
    return (
      <div className="brackets">
        <div className={"brackets-columns-" + this.props.totalRounds}>
          {this.renderRounds()}
        </div>
      </div>
    );
  }
});
