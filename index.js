const fs = require('fs');
const path = require('path');
const OpenCC = require('node-opencc');

function processFiles(directoryPath, fileExtensions) {
  const traverse = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverse(filePath); // Recursive call for subdirectories
      } else {
        const ext = path.extname(filePath).substring(1);
        
        if (!fileExtensions || fileExtensions.includes(ext)) {
          const content = fs.readFileSync(filePath, 'utf8');
          // console.log("content=>",content)
          const traditionalContent = OpenCC.simplifiedToTraditional(content);
          fs.writeFileSync(filePath, traditionalContent, 'utf8');
          console.log(`Converted ${filePath} from Simplified to Traditional Chinese.`);
        }
      }
    });
  };

  traverse(directoryPath);
}

module.exports = processFiles;