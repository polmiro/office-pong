/** @jsx React.DOM */

var Profile = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return { model: {} };
  },

  componentWillMount: function() {
    services.players.loadPlayer(this.props.id, {
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
        Hello {this.state.model.name}!
      </div>
    );
  }
});