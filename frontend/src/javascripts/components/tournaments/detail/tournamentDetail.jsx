/** @jsx React.DOM */

var TournamentDetail = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return { tournament: null };
  },

  componentWillMount: function() {
    services.tournaments.loadTournament(this.props.id, {
      success: function (response) {
        this.setState({ tournament: response });
      }.bind(this),
      error: function() {
        alert("oops;");
      }.bind(this)
    });
  },


  render: function() {
    if(this.state.tournament) {
      return (
        <Jumbotron>
          <h1>{this.state.tournament.title}</h1>
          <TournamentBrackets bracket={this.state.tournament.bracket} />
          <div className="clearfix" />
        </Jumbotron>
      );
    }
    else {
      return (
        <Jumbotron>
          <h1>loading...</h1>
        </Jumbotron>
      );
    }
  }
});