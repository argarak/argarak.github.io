'use strict';

var _ = require("underscore");
var fs = require("fs");
var circularJSON = require("circular-json");

function index(env, callback) {
    class ArticlesJSON extends env.plugins.Page {
        getFilename() {
            return 'articles.js';
        }

        getView() {
            return (env, locals, contents, templates, callback) => {
                var getArticles = function(contents) {
                    var articles;
                    articles = contents["articles"]._.directories.map(function(item) {
                        return item.index;
                    });
                    articles = articles.filter(function(item) {
                        return item.template !== 'none';
                    });
                    articles.sort(function(a, b) {
                        return b.date - a.date;
                    });
                    return _.chain(articles);
                }

                if (!locals.url) {
                    return callback(new Error('locals.url must be defined.'));
                }

                callback(null, new Buffer(circularJSON.stringify(getArticles(contents))));
            };
        }
    }

    env.registerGenerator('articlesjson', (contents, callback) => {
        callback(null, {'articles.js': new ArticlesJSON()});
    });

    callback();
}

module.exports = index;
