/** @jsx React.DOM */

var Tournament = React.createClass({
  propTypes: {
    tournament: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <div>
        <Link href={routeHelper.tournamentPath(this.props.tournament.id)}>
          Tournament: {this.props.tournament.title}
        </Link>
      </div>
    );
  }
});