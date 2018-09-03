/* eslint-disable */
const chalk = require('chalk');
const log = console.log;

const loaderUtils = require("loader-utils"),
    path = require("path");
const cnAttrReg = new RegExp(
    /(?:\s)([^:\s][\w-]+?=)(?:")([^."]*[\u4e00-\u9fa5]+[^"]*)(?:")/,
    "igm"
);
const cnTemplateReg = new RegExp(
    /(?:>|'|"|})([^"'>}\.-]*?[\u4e00-\u9fa5]+?[^"'<{]*?)(?:<|'|"|{)/, // 忽略 <!--形式的html注释
    "igm"
);
// const cnAttrReg = new RegExp(
//     /(?:\s)([^:\s][\w-]+?=)(?:")([^."]*[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u2018\u2019\u201c\u201d\uff08\uff09\u3001\uff1f\uff01\ufe15\u300a\u300b]+[^"]*)(?:")/,
//     "igm"
// );
// const cnTemplateReg = new RegExp(
//     /(?:>|'|"|})([^"'>}\.-]*?[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u2018\u2019\u201c\u201d\uff08\uff09\u3001\uff1f\uff01\ufe15\u300a\u300b]+?[^"'<{]*?)(?:<|'|"|{)/, // 忽略 <!--形式的html注释
//     "igm"
// );
let cheked = [];

function tips (type, pageKeyName, value) {
    cheked.push({
        pageKeyName, value, type
    })
}

let repeatReg;

function checkChinese (pageKeyName, source, repeatReg, prefix, hashLength) {
    // 去掉comments
    const withoutComment = source
        .replace(/\/\/\s*disable-autoi18n[\s\S]*\/\/\s*disable-autoi18n-end/, '')
        .replace(/([^:]\/\/\s.*)|(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)/g, ''); // prevent plugin replacing code outside vue instance
    // const script = withoutComment.match(/\<script\>([\s\S]*?)\<\/script\>/igm);
    const template = withoutComment.match(/\<template\>([\s\S]*)\<\/template\>/igm);
    const pageContent = {};
    source = source.replace(/([^:]\/\/\s.*)|(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)/g, '');
    if (template && template[0] && template[0].length) {
        const attrResults = template[0].match(cnAttrReg);
        if (attrResults) {
            attrResults.forEach((item, index) => {
                tips('属性', pageKeyName, item);
            })
        }
        const textResults = template[0].match(cnTemplateReg);
        if (textResults) {
            textResults.forEach((item, index) => {
                tips('文本', pageKeyName, item);
            })
        }
    }
    return { source, pageContent };
}

module.exports = function (source, map) {
    cheked = [];
    this.cacheable && this.cacheable(); // disable cache
    // handle query options
    const urlQuery = this.resourceQuery
        ? loaderUtils.parseQuery(this.resourceQuery)
        : null;
    const query = Object.assign({}, loaderUtils.getOptions(this), urlQuery);

    // file path
    const relativePath = this.resourcePath.replace(path.resolve(".") + "/", "");
    const pathArray = relativePath.split("/");
    const pageKeyName = pathArray.join("_").replace(".", "_");
    repeatReg = new RegExp(query.repeatFlag, "g");

    checkChinese(pageKeyName, source, repeatReg, query.prefix, query.hashLength);

    if (cheked.length) {
        log(chalk.red('【国际化】  ' + cheked[0].pageKeyName));
        cheked.map(e => {
            log(chalk.red(e.type + ':' + e.value))
        });
    }
    this.callback(null, source, map);
    return;
};
