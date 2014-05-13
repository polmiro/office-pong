/** @jsx React.DOM */

var WorstDefeat = React.createClass({
  propTypes: {
    game: React.PropTypes.object
  },

  render: function() {
    return (
      <div className="panel bg-dark">
        <div className="panel-body">
          <h2>Worst Defeat</h2>
        </div>
      </div>
    );
  }
});