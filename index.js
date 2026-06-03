const fs = require('fs');
const path = require('path');
const OpenCC = require('node-opencc');
const ignore = require('ignore');

// Load and parse a .gitignore file from the given directory.
// Returns an array of non-comment, non-blank lines (patterns).
function loadGitignore(dir) {
  const gitignorePath = path.join(dir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) return [];
  return fs
    .readFileSync(gitignorePath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
}

function processFiles(directoryPath, fileExtensions) {
  // Load root .gitignore patterns; gracefully degrade if none exists.
  const rootPatterns = loadGitignore(directoryPath);

  // Build an ignore instance from a pattern array.
  const makeIgnore = patterns =>
    patterns.length > 0 ? ignore().add(patterns) : ignore();

  const traverse = (dir, relativePath, patterns) => {
    let entries;
    try {
      entries = fs.readdirSync(dir);
    } catch (e) {
      return; // skip unreadable directories
    }

    const gitIgnore = makeIgnore(patterns);

    entries.forEach(entry => {
      // Build the path relative to the starting directory.
      const entryRelPath = relativePath === '.' ? entry : path.join(relativePath, entry);

      if (gitIgnore.ignores(entryRelPath)) return;

      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Load this subdirectory's .gitignore (if any) and merge with inherited patterns.
        const subPatterns = loadGitignore(fullPath);
        const childPatterns = subPatterns.length > 0 ? [...patterns, ...subPatterns] : patterns;
        traverse(fullPath, entryRelPath, childPatterns);
      } else {
        const ext = path.extname(fullPath).substring(1);
        if (!fileExtensions || fileExtensions.includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const traditionalContent = OpenCC.simplifiedToTraditional(content);
          fs.writeFileSync(fullPath, traditionalContent, 'utf8');
          console.log(`Converted ${fullPath} from Simplified to Traditional Chinese.`);
        }
      }
    });
  };

  traverse(directoryPath, '.', rootPatterns);
}

module.exports = processFiles;
