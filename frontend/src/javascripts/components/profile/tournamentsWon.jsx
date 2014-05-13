/** @jsx React.DOM */

var TournamentsWon = React.createClass({
  propTypes: {
    won: React.PropTypes.number
  },

  render: function() {
    return (
      <div className="panel stats bg-dark tournaments-won">
        <div className="panel-body">
          <div className="row">
            <div className="col-xs-2">
              <h1><i className="fa fa-trophy fa" /></h1>
            </div>
            <div className="col-xs-2 amount">
              <h1>{this.props.won}</h1>
            </div>
            <div className="col-xs-8 title">
              <h2>tournaments</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
});