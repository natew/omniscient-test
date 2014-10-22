var React = require('react');
var Immstruct = require('immstruct');
var Component = require('omniscient');
var d = React.DOM;

Component.debug();

var ARTICLES = [ {
  id: 0,
  title: 'article 1',
  comments: [
  { id: 1, text: 'hello' },
  { id: 2, text: 'how' },
  { id: 3, text: 'are' },
  { id: 4, text: 'you' }
] } ];

var ArticlePage = React.createClass({
  getInitialState: () => ({ version: 0 }),

  componentWillReceiveProps(nextProps) {
    if (nextProps.article) {
      this.structure = Immstruct(nextProps);
      this.structure.on('next-animation-frame', () => {
        this.setState({ version: ++this.state.version });
      });
    }
  },

  render() {
    if (!this.structure) return null;
    var article = this.structure.cursor().get('article');
    return Article(`AP-${article.get('id')}`, article);
  }
});

var Article = Component('Article', (article, statics) => {
  return (
    d.div(null,
      d.h3(null, article.get('title')),
      article.get('comments').map(comment => (
        Comment(`comment-${comment.get('id')}`, comment)
      )).toArray()
    )
  );
});

var Comment = Component('Comment', function(comment) {
  var changeComment = () => {
    comment.update('text', text => text + ' ok');
  };

  return (
    d.div({onClick: changeComment},
      d.p(null, comment.get('text')))
  );
});

React.renderComponent(ArticlePage(), document.body);

// simulate async props coming in later
setTimeout(function() {
  React.renderComponent(ArticlePage({ article: ARTICLES[0] }), document.body);
}, 1000);