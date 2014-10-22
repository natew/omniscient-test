var React = require('react');
var Immstruct = require('immstruct');
var Component = require('omniscient');
var d = React.DOM;

var article = [ {
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
      this.structure = Immstruct({ article: nextProps.article[0] });
      this.structure.on('next-animation-frame', () => {
        this.setState({ version: ++this.state.version });
      });
    }
  },

  render() {
    if (!this.structure) return null;
    var article = window.articleCursor = this.structure.cursor().get('article');
    var statics = { parent: this.props.parent };
    return Article(`AP-${article.get('id')}`, article, statics);
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
  var changeComment = (e) => {
    e.stopPropagation();
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
  React.renderComponent(ArticlePage({ article: article }), document.body);
}, 1000);