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
    .filter(line => line && !line.startsWith('#'))
    // Strip trailing '/' so 'node_modules/' matches the directory entry itself.
    .map(line => line.replace(/\/$/, ''))
    // Strip leading '/' (root-anchored) so '/node_modules' works at any depth,
    // matching git's behavior of anchoring to the .gitignore file's directory.
    .map(line => line.replace(/^\//, ''));
}

// Walk up from targetDir to find the nearest ancestor with .gitignore or .git.
// Returns the directory that should be considered the "gitignore root".
function findGitignoreRoot(targetDir) {
  let current = path.resolve(targetDir);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.gitignore'))) return current;
    if (fs.existsSync(path.join(current, '.git'))) return current;
    current = path.dirname(current);
  }
  // Check the root itself
  if (fs.existsSync(path.join(current, '.gitignore')) || fs.existsSync(path.join(current, '.git'))) return current;
  // Fall back to the target directory
  return targetDir;
}

// Collect all .gitignore files from gitRoot down to targetDir (inclusive).
// Returns [{ dir, patterns }] ordered from gitRoot to targetDir.
function collectGitignores(targetDir, gitRoot) {
  const result = [];
  const targetResolved = path.resolve(targetDir);
  const gitResolved = path.resolve(gitRoot);
  const relPath = path.relative(gitResolved, targetResolved);
  const segments = relPath === '' ? [] : relPath.split(path.sep);

  result.push({ dir: gitResolved, patterns: loadGitignore(gitResolved) });

  let current = gitResolved;
  for (const seg of segments) {
    current = path.join(current, seg);
    result.push({ dir: current, patterns: loadGitignore(current) });
  }

  return result;
}

function processFiles(directoryPath, fileExtensions) {
  // Find the gitignore root (nearest ancestor with .gitignore or .git)
  const gitRoot = findGitignoreRoot(directoryPath);
  const gitignores = collectGitignores(directoryPath, gitRoot);

  // Merge all patterns from root .gitignore down to target directory.
  // Patterns from parent .gitignore files are inherited cumulatively.
  const allPatterns = gitignores.flatMap(g => g.patterns);

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
      const entryRelPath = relativePath === '.' ? entry : path.join(relativePath, entry);

      if (gitIgnore.ignores(entryRelPath)) return;

      const fullPath = path.join(dir, entry);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        return; // skip broken symlinks or inaccessible files
      }

      if (stat.isDirectory()) {
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

  traverse(directoryPath, '.', allPatterns);
}

module.exports = processFiles;
