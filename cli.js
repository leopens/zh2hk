#!/usr/bin/env node

const processFiles = require('./index.js');
const pkg = require('./package.json');

const VERSION = pkg.version;
const NAME = pkg.name;

function printHelp() {
  console.log(`${NAME} v${VERSION} — Simplified to Traditional Chinese (Hong Kong standard) converter`);
  console.log('');
  console.log('Usage:');
  console.log(`  zh2hk <directory_path> <file_extensions...>   # e.g. zh2hk ./src "*.js" "*.ts"`);
  console.log(`  zh2hk <directory_path> *.*                    # convert all files`);
  console.log('');
  console.log('Options:');
  console.log(`  -h, --help     Show this help message`);
  console.log(`  -v, --version  Show version number`);
  console.log('');
  console.log('Notes:');
  console.log('  Files matched by .gitignore patterns (including parent directories) are skipped automatically.');
  console.log('  Conversion is done in-place with no undo capability.');
}

function printVersion() {
  console.log(`zh2hk v${VERSION}`);
}

// Handle --help and --version flags
if (process.argv.includes('-h') || process.argv.includes('--help')) {
  printHelp();
  process.exit(0);
}

if (process.argv.includes('-v') || process.argv.includes('--version')) {
  printVersion();
  process.exit(0);
}

// Check if the command line arguments include the directory path and file extensions
if (process.argv.length < 4) {
  printHelp();
  process.exit(1);
}

const directoryPath = process.argv[2];
let fileExtensions = (process.argv[3] === '*.*' || process.argv[3] === '*') ? null : process.argv.slice(3);

if (fileExtensions && fileExtensions.length > 0) {
  fileExtensions = fileExtensions.map(ext => ext.replace(/^\*\./, ''));
}

processFiles(directoryPath, fileExtensions);