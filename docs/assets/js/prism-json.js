Prism.languages.json = {
    'property': /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
    'string': {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: true
    },
    'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    'punctuation': /[{}[\]);,]/,
    'operator': /:/g,
    'boolean': /\b(?:true|false)\b/i,
    'null': /\bnull\b/i
};

Prism.languages.jsonp = Prism.languages.json;