/** @jsx React.DOM */

var TournamentsList = React.createClass({
  getInitialState: function() {
    return { tournaments: [] }
  },

  componentWillMount: function() {
    services.tournaments.loadTournaments({
      success: function (response) {
        this.setState({ tournaments: response });
      }.bind(this),
      error: function() {
        alert("oops;");
      }.bind(this)
    });
  },

  renderTournaments: function() {
    return $.map(this.state.tournaments, function(tournament, index) {
      return <Tournament key={index} tournament={tournament} />
    });
  },
  render: function() {
    return (
      <div>
        {this.renderTournaments()}
      </div>
    );
  }
});