import * as highlight from 'highlight.js';

export default function(hljs: typeof highlight): Language {
  var HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  return {
    aliases: ['robotstxt', 'robots.txt'],
    case_insensitive: true,
    keywords: {
      $pattern: /[a-z-]+/,
      section: 'user-agent',
      built_in: 'allow disallow',
      keyword: 'crawl-delay sitemap'
    },
    contains: [
      HASH_COMMENT_MODE,
      hljs.NUMBER_MODE,
      {
        className: 'string',
        begin: '^\\s*(?:user-agent|(?:dis)?allow)\\s*:\\s*',
        end: /$/,
        excludeBegin: true,
        relevance: 10,
        contains: [
          HASH_COMMENT_MODE
        ]
      },
      {
        className: 'string',
        begin: '^\\s*sitemap\\s*:\\s*',
        end: /$/,
        excludeBegin: true,
        contains: [
          HASH_COMMENT_MODE
        ]
      }
    ],
    illegal: '<(?:!DOCTYPE\\s+)?html>'
  }
}