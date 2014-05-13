/** @jsx React.DOM */

var VictoryStats = React.createClass({
  propTypes: {
    won: React.PropTypes.number,
    lost: React.PropTypes.number
  },

  sum: function() {
    return this.props.won + this.props.lost;
  },

  calculatePercentage: function() {
    if(this.sum() == 0) return 0;
    return Math.floor(100 * this.props.won / this.sum());
  },

  calculateColor: function() {
    var percentage = this.calculatePercentage();
    if(percentage > 60) {
      return "#7ea568"
    }
    else if (percentage < 40) {
      return "#dc6969";
    }
    else {
      return "#dca961";
    }
  },

  renderDiscreteStats: function() {
    return (
      <div>
        <div className="row main-stat">
          <div className="col-xs-4">
            <i className="fa fa-user fa-4x" />
          </div>
          <div className="col-xs-8">
            <small className="stat-title">Games Played</small>
            <h1>{this.sum()}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <small className="stat-title">Won</small>
            <div className="live-tile">
              <h3>{this.props.won}</h3>
            </div>
          </div>
          <div className="col-xs-6">
            <small className="stat-title">Lost</small>
            <div className="live-tile">
              <h3>{this.props.lost}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderPercentageStats: function() {
    return (
      <Circliful
        percentage={this.calculatePercentage()}
        fgColor={this.calculateColor()}
        bgColor="#999"
        fill="#2b2e33"
      />
    );
  },

  render: function() {
    return (
      <div className="panel stats bg-dark">
        <div className="panel-body">
          <div className="row">
            <div className="col-xs-7">
              {this.renderDiscreteStats()}
            </div>
            <div className="col-xs-5 percentage-stats">
              {this.renderPercentageStats()}
            </div>
          </div>
        </div>
      </div>
    );
  }
});