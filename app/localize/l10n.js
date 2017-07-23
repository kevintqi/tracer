"use strict"

var Localize = require('localize');

class l10n {
    constructor(lang) {
        this.lang = lang;
        this.action = new Localize(__dirname + '/translation/');
        this.action.setLocale(lang);
    }

    setLang(lang) {
        this.lang = lang;
        this.action.setLocale(lang);
    }

    translate(key) {
        return this.action.translate(key); 
    }

    translate(key, item) {
        return this.action.translate(key, item);
    }
}

module.exports = l10n;