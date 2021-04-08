import * as highlight from 'highlight.js';

const COMMENTS = {
  className: "comment",
  variants: [
    highlight.C_BLOCK_COMMENT_MODE,
    highlight.C_LINE_COMMENT_MODE
  ]
};

const KEYWORDS = {};

const SUBST: Mode = {
  className: 'subst',
  begin: '\\$\\{',
  end: '\\}',
  keywords: KEYWORDS,
  contains: [], // defined later
};

const STRING: Mode = {
  className: 'string',
  begin: '\'',
  end: '\'',
  contains: [
    highlight.BACKSLASH_ESCAPE,
    SUBST,
  ],
}
const SUBST_INTERNALS = [
  highlight.APOS_STRING_MODE,
  highlight.QUOTE_STRING_MODE,
  STRING,
];

SUBST.contains = [
  ...SUBST_INTERNALS,
  {
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS,
    contains: [
      "self",
      ...SUBST_INTERNALS
    ],
  }
];

export default function(hljs: typeof highlight): Language {
  return {
    aliases: ['bicep'],
    case_insensitive: true,
    keywords: {
      $pattern: /[a-z-]+/,
      section: 'user-agent',
      built_in: 'allow disallow',
      keyword: 'crawl-delay sitemap'
    },
    contains: [
      COMMENTS,
      STRING,
    ],
  }
}