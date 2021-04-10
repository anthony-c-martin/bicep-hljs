import * as highlight from 'highlight.js';

const bounded = (text: string) => `\\b${text}\\b`;
const after = (regex: string) => `(?<=${regex})`;
const notAfter = (regex: string) => `(?<!${regex})`;
const before = (regex: string) => `(?=${regex})`;
const notBefore = (regex: string) => `(?!${regex})`;

const identifierStart = "[_a-zA-Z]";
const identifierContinue = "[_a-zA-Z0-9]";
const identifier = bounded(`${identifierStart}${identifierContinue}*`);

// whitespace. ideally we'd tokenize in-line block comments, but that's a lot of work. For now, ignore them.
const ws = `(?:\\s|/\\*.*\\*/)*`;

const KEYWORDS = {
  $pattern: '[A-Za-z$_][0-9A-Za-z$_]*',
  keyword: [
    'targetScope',
    'resource',
    'module',
    'param',
    'var',
    'output',
    'for',
    'in',
    'if',
  ],
  literal: [
    "true",
    "false",
    "null",
  ],
  built_in: [
    'az',
    'sys',
  ]
};

const lineComment: Mode = {
  className: 'comment',
  match: `//.*$`,
};

const blockComment: Mode = {
  className: 'comment',
  begin: `/\\*`,
  end: `\\*/`,
};

const comments: Mode = {
  variants: [lineComment, blockComment],
};

const expression: Mode = {
  keywords: KEYWORDS,
  variants: [
    /* placeholder filled later due to cycle*/
  ],
};

const escapeChar: Mode = {
  match: `\\\\(u{[0-9A-Fa-f]+}|n|r|t|\\\\|'|\\\${)`,
};

const stringVerbatim: Mode = {
  className: 'string',
  begin: `'''`,
  end: `'''`,
  contains: [],
}

const stringSubstitution: Mode = {
  className: 'subst',
  begin: `${notAfter(`\\\\`)}(\\\${)`,
  end: `(})`,
  contains: [expression],
};

const stringLiteral: Mode = {
  className: 'string',
  begin: `'${notBefore(`''`)}`,
  end: `'`,
  contains: [
    escapeChar,
    stringSubstitution
  ],
};

const numericLiteral: Mode = {
  className: "number",
  match: `[0-9]+`,
};

const namedLiteral: Mode = {
  className: 'literal',
  match: bounded(`(true|false|null)`),
  relevance: 0,
};

const identifierExpression: Mode = {
  className: "variable",
  match: `${identifier}${notBefore(`${ws}\\(`)}`,
};

const objectPropertyKeyIdentifier: Mode = {
  className: "property",
  match: `(${identifier})`,
};

const objectProperty: Mode = {
  begin: `^${notBefore(`${ws}}`)}`,
  end: `$`,
  contains: [
    {
      begin: `^${ws}`,
      end: `${ws}:`,
      contains: [
        stringLiteral,
        objectPropertyKeyIdentifier,
      ],
    },
    {
      begin: `${after(`:`)}${ws}`,
      end: `${ws}$`,
      contains: [expression],
    },
  ],
};

const objectLiteral: Mode = {
  begin: `{`,
  end: `}`,
  contains: [objectProperty]
}

const arrayLiteral: Mode = {
  begin: `\\[${ws}${notBefore(bounded(`for`))}`,
  end: `]`,
  contains: [expression],
};

const functionCall: Mode = {
  className: 'function',
  begin: `(${identifier})${ws}\\(`,
  end: `\\)`,
  contains: [expression],
};

expression.variants = [
  stringLiteral,
  stringVerbatim,
  numericLiteral,
  namedLiteral,
  objectLiteral,
  arrayLiteral,
  identifierExpression,
  functionCall,
];

export default function(hljs: typeof highlight): Language {
  return {
    aliases: ['bicep'],
    case_insensitive: true,
    keywords: KEYWORDS,
    contains: [
      comments,
      expression,
    ],
  }
}