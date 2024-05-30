# zh2hk

[![NPM version](https://img.shields.io/npm/v/zh2hk.svg)](https://www.npmjs.com/package/zh2hk)
[![Downloads](https://img.shields.io/npm/dm/zh2hk.svg)](https://www.npmjs.com/package/zh2hk)
[![License](https://img.shields.io/npm/l/zh2hk.svg)](https://github.com/yourusername/zh2hk/blob/master/LICENSE)

**[中文版 README](README.md)**

`zh2hk` is a Node.js command-line tool designed to convert file contents from Simplified Chinese to Traditional Chinese (Hong Kong standard).

## Features

- Supports multiple file extensions.
- Supports the `*.*` wildcard for converting all files in a specified directory.
- User-friendly command-line interface.

## Installation

Install `zh2hk` globally using npm:

```sh
npm install -g zh2hk
```

## Run
```sh
zh2hk ./ txt vue  #convert *.txt file and *.vue file
zh2hk ./ .txt .vue #convert *.txt file and *.vue file
zh2hk ./ "*" #convert all file of current folder
zh2hk ./ "*.*" #convert all file of current folder
```
or
```sh
npx zh2hk ./ txt vue  #convert *.txt file and *.vue file
npx zh2hk ./ .txt .vue #convert *.txt file and *.vue file
npx zh2hk ./ "*" #convert all file of current folder
npx zh2hk ./ "*.*" #convert all file of current folder
```