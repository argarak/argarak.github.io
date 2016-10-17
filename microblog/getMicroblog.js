/**
 *
 * @source: http://www.argarak.github.io/js/main.js
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright 2016 Jakub Kukiełka
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

var card = ["<div class=\"row postsRow card transparent\"><div class=\"col s3 hide-on-med-and-down\"><img id=\"microThumb\" src=\"/index/nexus.svg\"></div><div class=\"col l9 m12\"><div class=\"post-item card no-shadow transparent\"><div class=\"card-content white-text\"><span class=\"card-title\">", "</span><p class=\"flow-text\">", "</p></div><div class=\"card-action\">", "</div></div></div>"]

var url = 'https://pump2rss.com/feed/argarak@pumpyourself.com.atom';
feednami.load(url,function(result) {
    if(result.error) {
        console.log(result.error);
    } else {
        for(var i = 0; i < result.feed.entries.length; i++) {
            if(result.feed.entries[i].description != null &&
               result.feed.entries[i].description != "<a href='https://pumpyourself.com/argarak'>argarak</a> deleted a note" &&
               result.feed.entries[i].description != "<a href='https://pumpyourself.com/argarak'>argarak</a> deleted an image") {
                console.log(result.feed.entries);
                $("#microblogPosts").append(card[0] + "<a href=\"" + result.feed.entries[i].link + "\" class=\"post-title\">" + result.feed.entries[i].author + " at " + result.feed.entries[i].date + "</a>" + card[1] + result.feed.entries[i].description + card[2] + card[3]);
            }
        }
    }
});
