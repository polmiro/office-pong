/** @jsx React.DOM */

var StatsBox = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    stat: React.PropTypes.string.isRequired,
    leftTitle: React.PropTypes.string.isRequired,
    leftStat: React.PropTypes.string.isRequired,
    rightTitle: React.PropTypes.string.isRequired,
    rightStat: React.PropTypes.string.isRequired,
    iconClassName: React.PropTypes.string.isRequired,
    panelClassName: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className={"panel stats " + this.props.panelClassName}>
        <div className="panel-body">
          <div className="row main-stat">
            <div className="col-xs-3">
              <i className={this.props.iconClassName} />
            </div>
            <div className="col-xs-9">
              <small className="stat-title">{this.props.title}</small>
              <h1>{this.props.stat}</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <small className="stat-title">{this.props.leftTitle}</small>
              <div className="live-tile">
                <h3>{this.props.leftStat}</h3>
              </div>
            </div>
            <div className="col-xs-6">
              <small className="stat-title">{this.props.rightTitle}</small>
              <div className="live-tile">
                <h3>{this.props.rightStat}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});