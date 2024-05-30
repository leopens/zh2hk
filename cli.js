#!/usr/bin/env node

const processFiles = require('./index.js');

// Check if the command line arguments include the directory path and file extensions
if (process.argv.length < 4) {
  console.log('Usage: npx zh2hk <directory_path> <file_extensions...> or *.* for all files');
  process.exit(1);
}
// console.log("process.argv[3]=>",process.argv[3]);

const directoryPath = process.argv[2];
let fileExtensions = (process.argv[3] === '*.*' || process.argv[3] === '*') ? null : process.argv.slice(3);
// console.log("fileExtensions=>",fileExtensions);


// 如果有文件扩展名参数，转换为数组并去除'*.'
if (fileExtensions && fileExtensions.length > 0) {
  fileExtensions = fileExtensions.map(ext => ext.replace(/^\*\./, ''));
}

// 调用 processFiles 函数
processFiles(directoryPath, fileExtensions);