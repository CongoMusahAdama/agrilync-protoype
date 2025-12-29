const fs = require('fs');

function findDuplicateAttrs(content) {
    const tagRegex = /<([A-Z][a-zA-Z0-9.]+|[a-z][a-z0-9-]*)\s+([^>]+)\/?>/gs;
    const results = [];
    let match;

    while ((match = tagRegex.exec(content)) !== null) {
        const tagName = match[1];
        const attrsStr = match[2];

        // Match attribute names: word characters followed by = or space/end of string
        const attrNameRegex = /([a-zA-Z0-9-]+)(?:\s*=\s*(?:\{[^\}]+\}|"[^"]*"|'[^']*')|\s+|$)/g;
        const attrNames = [];
        let attrMatch;
        while ((attrMatch = attrNameRegex.exec(attrsStr)) !== null) {
            attrNames.push(attrMatch[1]);
        }

        const seen = new Set();
        const duplicates = new Set();
        for (const name of attrNames) {
            if (seen.has(name)) {
                duplicates.add(name);
            }
            seen.add(name);
        }

        if (duplicates.size > 0) {
            results.push({
                tag: tagName,
                duplicates: Array.from(duplicates),
                full: attrsStr.trim()
            });
        }
    }
    return results;
}

const filePath = 'src/pages/agent/AgentProfile.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const duplicates = findDuplicateAttrs(content);

if (duplicates.length > 0) {
    duplicates.forEach(d => {
        console.log(`Duplicate attributes [${d.duplicates.join(', ')}] in tag <${d.tag}>`);
        console.log(`Full attributes string: ${d.full}`);
        console.log('-'.repeat(20));
    });
} else {
    console.log('No duplicate attributes found.');
}
