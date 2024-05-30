# zh2hk

[![NPM version](https://img.shields.io/npm/v/zh2hk.svg)](https://www.npmjs.com/package/zh2hk)
[![Downloads](https://img.shields.io/npm/dm/zh2hk.svg)](https://www.npmjs.com/package/zh2hk)
[![License](https://img.shields.io/npm/l/zh2hk.svg)](https://github.com/yourusername/zh2hk/blob/master/LICENSE)

**[English README](README-en.md)**

`zh2hk` 是一个Node.js命令行工具，用于将文件内容从简体中文转换为繁体中文（香港标准）。

## 特点

- 支持多种文件扩展名。
- 支持`*.*`通配符，以转换指定目录下的所有文件。
- 易于使用的命令行界面。

## 安装

使用npm安装 `zh2hk`:

```sh
npm install -g zh2hk
```

## 执行
```sh
zh2hk ./ txt vue  #转换txt文件和vue文件
zh2hk ./ .txt .vue #转换txt文件和vue文件
zh2hk ./ "*" #转换所有文件
zh2hk ./ "*.*" #转换所有文件
```
or
```sh
npx zh2hk ./ txt vue  #转换txt文件和vue文件
npx zh2hk ./ .txt .vue #转换txt文件和vue文件
npx zh2hk ./ "*" #转换所有文件
npx zh2hk ./ "*.*" #转换所有文件
```