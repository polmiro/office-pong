/** @jsx React.DOM */

var GreatestVictory = React.createClass({
  propTypes: {
    game: React.PropTypes.object
  },

  render: function() {
    return (
      <div className="panel bg-dark">
        <div className="panel-body">
          <h2>Greatest Victory</h2>
        </div>
      </div>
    );
  }
});