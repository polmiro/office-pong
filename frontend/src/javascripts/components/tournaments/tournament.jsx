/** @jsx React.DOM */

var Tournament = React.createClass({
  propTypes: {
    model: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <div>
        <Link href={routeHelper.tournamentPath(this.props.model.id)}>
          Tournament: {this.props.model.title}
        </Link>
      </div>
    );
  }
});