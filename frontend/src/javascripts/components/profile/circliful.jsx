/** @jsx React.DOM */

var Circliful = React.createClass({
  propTypes: {
    percentage: React.PropTypes.number.isRequired,
    info: React.PropTypes.string.isRequired,
    fgColor: React.PropTypes.string.isRequired,
    bgColor: React.PropTypes.string,
    fontSize: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fgColor: "#dc6969",
      bgColor: "#eee",
      fill: "#fff",
      fontSize: "30",
      border: "outline",
      width: "15",
      dimension: "120"
    }
  },

  percentageText: function() {
    return "" + this.props.percentage + "%";
  },

  componentDidMount: function() {
    this.circliful();
  },

  componentDidUpdate: function() {
    this.circliful();
  },

  circliful: function() {
    $(this.refs.div.getDOMNode()).html("").circliful();
  },

  render: function() {
    return (
      <div
        key={this.props.percentage}
        ref="div"
        data-dimension={this.props.dimension}
        data-percent={this.props.percentage}
        data-text={this.percentageText()}
        data-info={this.props.info}
        data-fontsize={this.props.fontSize}
        data-fgcolor={this.props.fgColor}
        data-bgcolor={this.props.bgColor}
        data-border={this.props.border}
        data-fill={this.props.fill}
        data-width={this.props.width}
        className="circliful"
      />
    );
  }
});

