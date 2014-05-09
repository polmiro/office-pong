/** @jsx React.DOM */

var TournamentDetail = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return { model: {} };
  },

  componentWillMount: function() {
    services.tournaments.loadTournament(this.props.id, {
      success: function (response) {
        this.setState({ model: response });
      }.bind(this),
      error: function() {
        alert("oops;");
      }.bind(this)
    });
  },


  render: function() {
    return (
      <div>
        {this.state.model.title}
      </div>
    );
  }
});