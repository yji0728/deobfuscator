/**
 * JavaScript Deobfuscator Library
 * Handles various types of JavaScript obfuscation and packing
 */

const Deobfuscator = {
    /**
     * Main deobfuscation function
     */
    deobfuscate: function(code, options = {}) {
        let result = code;
        let iterations = 0;
        const maxIterations = 10;
        
        // Keep deobfuscating until no more changes or max iterations reached
        while (iterations < maxIterations) {
            const before = result;
            
            // Try different deobfuscation techniques
            if (options.unpackEval !== false) {
                result = this.unpackEval(result);
            }
            
            if (options.unpackPacker !== false) {
                result = this.unpackPacker(result);
            }
            
            result = this.decodeHexStrings(result);
            result = this.decodeUnicodeEscapes(result);
            result = this.simplifyArrayAccess(result);
            
            // If nothing changed, we're done
            if (result === before) {
                break;
            }
            
            iterations++;
        }
        
        // Beautify if requested
        if (options.beautify !== false) {
            result = this.beautify(result);
        }
        
        return result;
    },

    /**
     * Unpack eval-based obfuscation
     */
    unpackEval: function(code) {
        // Pattern 1: eval(function(p,a,c,k,e,d){...})
        const evalPattern = /eval\s*\(\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*\([^)]*\)\s*\)/g;
        
        try {
            code = code.replace(evalPattern, (match) => {
                try {
                    // Create a safe environment to execute the eval
                    const safeEval = match.replace(/^eval\s*\(/, '(') + ';';
                    const result = this.safeEval(safeEval);
                    return result || match;
                } catch (e) {
                    return match;
                }
            });
        } catch (e) {
            // If unpacking fails, return original code
        }

        // Pattern 2: Simple eval(...) with string
        const simpleEvalPattern = /eval\s*\(\s*(['"`])((?:(?!\1).)*)\1\s*\)/g;
        try {
            code = code.replace(simpleEvalPattern, (match, quote, content) => {
                try {
                    return content;
                } catch (e) {
                    return match;
                }
            });
        } catch (e) {
            // If unpacking fails, return original code
        }

        return code;
    },

    /**
     * Unpack Dean Edwards Packer obfuscation
     */
    unpackPacker: function(code) {
        // Detect packer pattern
        const packerPattern = /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*[rd]\s*\)/;
        
        if (!packerPattern.test(code)) {
            return code;
        }

        try {
            // Extract the packed code
            const match = code.match(/\}\s*\(\s*'(.*?)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'(.*?)'\./);
            
            if (!match) {
                return code;
            }

            const payload = match[1];
            const radix = parseInt(match[2]);
            const count = parseInt(match[3]);
            const symtab = match[4];

            // Split the symbol table
            const symbols = symtab.split('|');

            // Unpack function
            const unpack = (p, a, c, k) => {
                while (c--) {
                    if (k[c]) {
                        const regex = new RegExp('\\b' + c.toString(a) + '\\b', 'g');
                        p = p.replace(regex, k[c]);
                    }
                }
                return p;
            };

            const unpacked = unpack(payload, radix, count, symbols);
            return unpacked || code;

        } catch (e) {
            return code;
        }
    },

    /**
     * Decode hexadecimal strings
     */
    decodeHexStrings: function(code) {
        // Pattern: "\x48\x65\x6c\x6c\x6f"
        const hexPattern = /(['"])(?:\\x[0-9a-fA-F]{2})+\1/g;
        
        try {
            code = code.replace(hexPattern, (match) => {
                try {
                    // Remove quotes and decode
                    const hex = match.slice(1, -1);
                    const decoded = hex.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => {
                        return String.fromCharCode(parseInt(hex, 16));
                    });
                    return '"' + decoded.replace(/"/g, '\\"') + '"';
                } catch (e) {
                    return match;
                }
            });
        } catch (e) {
            // If decoding fails, return original code
        }

        return code;
    },

    /**
     * Decode Unicode escape sequences
     */
    decodeUnicodeEscapes: function(code) {
        // Pattern: "\u0048\u0065\u006c\u006c\u006f"
        const unicodePattern = /(['"])(?:\\u[0-9a-fA-F]{4})+\1/g;
        
        try {
            code = code.replace(unicodePattern, (match) => {
                try {
                    const unicode = match.slice(1, -1);
                    const decoded = unicode.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
                        return String.fromCharCode(parseInt(hex, 16));
                    });
                    return '"' + decoded.replace(/"/g, '\\"') + '"';
                } catch (e) {
                    return match;
                }
            });
        } catch (e) {
            // If decoding fails, return original code
        }

        return code;
    },

    /**
     * Simplify array access patterns
     */
    simplifyArrayAccess: function(code) {
        // Pattern: var _0x1234 = ['value1', 'value2']; ... _0x1234[0] -> 'value1'
        try {
            // This is a simplified version - real implementation would be more complex
            const arrayPattern = /var\s+(_0x[a-fA-F0-9]+)\s*=\s*\[([^\]]+)\]/g;
            const arrays = {};
            
            code = code.replace(arrayPattern, (match, varName, content) => {
                try {
                    // Parse array content
                    const items = content.split(',').map(s => s.trim());
                    arrays[varName] = items;
                    return match;
                } catch (e) {
                    return match;
                }
            });

            // Replace array access
            for (const [varName, items] of Object.entries(arrays)) {
                const accessPattern = new RegExp(varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\[(\\d+)\\]', 'g');
                code = code.replace(accessPattern, (match, index) => {
                    const idx = parseInt(index);
                    return items[idx] || match;
                });
            }
        } catch (e) {
            // If simplification fails, return original code
        }

        return code;
    },

    /**
     * Safe eval function
     */
    safeEval: function(code) {
        try {
            // This is still potentially unsafe, but better than direct eval
            const func = new Function('return ' + code);
            return func();
        } catch (e) {
            return null;
        }
    },

    /**
     * Beautify/format JavaScript code
     */
    beautify: function(code) {
        try {
            let result = code;
            let indent = 0;
            let inString = false;
            let stringChar = '';
            let formatted = '';
            let i = 0;

            while (i < result.length) {
                const char = result[i];
                const nextChar = result[i + 1];

                // Handle strings
                if ((char === '"' || char === "'" || char === '`') && (i === 0 || result[i - 1] !== '\\')) {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                    } else if (char === stringChar) {
                        inString = false;
                    }
                    formatted += char;
                    i++;
                    continue;
                }

                if (inString) {
                    formatted += char;
                    i++;
                    continue;
                }

                // Handle formatting
                if (char === '{' || char === '[') {
                    formatted += char;
                    if (nextChar !== '}' && nextChar !== ']') {
                        indent++;
                        formatted += '\n' + '  '.repeat(indent);
                    }
                } else if (char === '}' || char === ']') {
                    if (formatted[formatted.length - 1] !== '\n') {
                        indent--;
                        formatted += '\n' + '  '.repeat(indent);
                    } else {
                        indent--;
                        formatted = formatted.trimEnd() + '\n' + '  '.repeat(indent);
                    }
                    formatted += char;
                } else if (char === ';') {
                    formatted += char;
                    if (nextChar !== '\n' && nextChar !== ' ') {
                        formatted += '\n' + '  '.repeat(indent);
                    }
                } else if (char === ',') {
                    formatted += char;
                    if (nextChar !== ' ' && nextChar !== '\n') {
                        formatted += ' ';
                    }
                } else if (char === '\n') {
                    // Skip multiple newlines
                    if (formatted[formatted.length - 1] !== '\n') {
                        formatted += '\n' + '  '.repeat(indent);
                    }
                } else if (char === ' ' && (nextChar === ' ' || formatted[formatted.length - 1] === ' ')) {
                    // Skip multiple spaces
                } else {
                    formatted += char;
                }

                i++;
            }

            return formatted.trim();
        } catch (e) {
            return code;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Deobfuscator;
}
