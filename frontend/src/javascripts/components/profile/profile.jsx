/** @jsx React.DOM */

var Profile = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      player: {},
      stats: {}
    };
  },

  componentWillMount: function() {
    services.players.loadPlayer(this.props.id, {
      success: function (response) {
        this.setState({ player: response });
      }.bind(this),
      error: function() {
        alert("oops;");
      }.bind(this)
    });

    services.players.loadPlayerStats(this.props.id, {
      success: function (response) {
        this.setState({ stats: response });
      }.bind(this),
      error: function() {
        alert("oops;");
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-4">
            <div className="row">
              <div className="col-lg-12">
                <VictoryStats
                  lost={this.state.stats.games_lost_count}
                  won={this.state.stats.games_won_count}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <PointsStats
                  lost={this.state.stats.points_lost_count}
                  won={this.state.stats.points_won_count}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <TournamentsWon
                  won={this.state.stats.tournaments_won_count}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="row">
              <div className="col-lg-12">
                <ProfileActivity />
              </div>
              <div className="col-lg-12">
                <WorstDefeat game={this.state.stats.worst_defeat} />
              </div>
              <div className="col-lg-12">
                <GreatestVictory game={this.state.stats.greatest_victory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});