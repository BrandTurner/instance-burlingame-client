var React = require('react');

var Footer = React.createClass({

  render: function() {
    return <footer>
        <a className={('button-secondary full-width')} href="#">Visit Full Site</a>
    </footer>;
  }

});

module.exports = Footer;