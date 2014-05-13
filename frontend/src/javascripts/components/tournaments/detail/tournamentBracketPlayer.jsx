/** @jsx React.DOM */

var TournamentBracketPlayer = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired
  },

  render: function() {
    if(this.props.player) {
      return (
        <div className="tournament-player">
          <div className="avatar">
            <img src={this.props.player.avatar_url} />
          </div>
          <div className="name">{this.props.player.name}</div>
        </div>
      );
    }
    else {
      return <div/>;
    }
  }
});