/** @jsx React.DOM */

var WelcomePage = React.createClass({
  render: function() {
    return (
      <Jumbotron>
        <h1>Hello!</h1>
        <p>Welcome to your ping pong office.</p>
        <p><Button bsStyle="primary">Learn more</Button></p>
      </Jumbotron>
    );
  }
});