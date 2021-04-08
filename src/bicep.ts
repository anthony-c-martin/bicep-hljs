import * as highlight from 'highlight.js';

const bounded = (text: string) => `\\b${text}\\b`;
const after = (regex: string) => `(?<=${regex})`;
const notAfter = (regex: string) => `(?<!${regex})`;
const before = (regex: string) => `(?=${regex})`;
const notBefore = (regex: string) => `(?!${regex})`;

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
  begin: `${notAfter(`\\\\`)}(\\\${)`,
  end: `(})`,
  keywords: KEYWORDS,
  contains: [], // defined later
};

const STRING_VERBATIM: Mode = {
  className: 'string',
  begin: `'''`,
  end: `'''`,
  contains: []
}

const STRING: Mode = {
  className: 'string',
  begin: `'${notBefore(`''`)}`,
  end: `'`,
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
    begin: `\\{`,
    end: `\\}`,
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
    keywords: KEYWORDS,
    contains: [
      COMMENTS,
      STRING,
      STRING_VERBATIM,
    ],
  }
}