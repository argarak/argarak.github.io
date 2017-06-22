/*
 * Copyright (c) 2016 Jakub Kukiełka
 *
 * This file is part of argarak.github.io.
 *
 * argarak.github.io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * argarak.github.io is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with argarak.github.io. If not, see <http://www.gnu.org/licenses/>.
 *
 */

var updateHighlighting = function() {
    var codeElements = document.getElementsByTagName('code');
    for(var i = 0; i < codeElements.length; i++)
        hljs.highlightBlock(codeElements[i]);
}

var navIndex = {
    home: 0,
    about: 1,
    blog: 2,
    programs: 3,
    archive: 4,
    microblog: 5,
    changelog: 6,
}

var app = angular.module("nexus", ["ngMaterial", "ngAnimate", "mdLightbox",
                                   "truncate", "ngSanitize", "ui.router"])
                 .config(function($mdThemingProvider) {
                     $mdThemingProvider.theme('default')
                                       .primaryPalette("red")
                                       .accentPalette("pink")
                                       .dark();
                     $mdThemingProvider.theme('light')
                                       .primaryPalette("red")
                                       .accentPalette("pink");
                 })
                 .config(["$stateProvider", "$urlRouterProvider", function($stateProvider,
                                                                           $urlRouterProvider) {
                     $urlRouterProvider.otherwise("/home");

                     $stateProvider
                         .state("navbar", {
                             url: "/:name",
                             templateUrl: function($stateParams) {
                                 return "/" + $stateParams.name + "/index.html";
                             },
                             controller: function($rootScope, $scope, $stateParams) {
                                 $stateParams.title = $stateParams.name;
                                 $rootScope.$stateParams = $stateParams;
                                 $scope.name = $stateParams.name;
                                 updateHighlighting();
                             }
                         })
                         .state("blog", {
                             url: "/articles/:name?title",
                             templateUrl: function($stateParams) {
                                 return "/articles/" + $stateParams.name + "/index.html";
                             },
                             controller: function($rootScope, $scope, $stateParams) {
                                 $rootScope.$stateParams = $stateParams;
                                 $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
                                     var leaving = angular.element(document.getElementByTag(""))
                                 });
                                 updateHighlighting();
                             }
                         });
                 }])
                 .config(['$sceDelegateProvider', function($sceDelegateProvider) {
                     $sceDelegateProvider.resourceUrlWhitelist([
                         'self',
                         'https://diasp.eu/**',
                         'http://videobin.org/**'
                     ]);
                 }]);

app.controller("mainController", function($scope, $mdSidenav, $mdDialog, $state, $rootScope) {
    $scope.getState = function() {
        return $state.current.name;
    }

    $scope.getMonth = function(index) {
        switch(index) {
            case 0:  return "January";   break;
            case 1:  return "February";  break;
            case 2:  return "March";     break;
            case 3:  return "April";     break;
            case 4:  return "May";       break;
            case 5:  return "June";      break;
            case 6:  return "July";      break;
            case 7:  return "August";    break;
            case 8:  return "September"; break;
            case 9:  return "October";   break;
            case 10: return "November";  break;
            case 11: return "December";  break;
            default: console.log("Undefined month " + index + " out of bounds!");
        }
    }

    $scope.showAlert = function(ev, title, text, ok) {
        $mdDialog.show(
            $mdDialog.alert()
                     .parent(angular.element(document.querySelector("#popupContainer")))
                     .clickOutsideToClose(true)
                     .title(title)
                     .textContent(text)
                     .ariaLabel(title)
                     .ok(ok)
                     .targetEvent(ev)
        );
    }

    $scope.projectToolbar = false;
});

app.directive('animchange', function($animate, $timeout) {
    return function(scope, elem, attr) {
        scope.$watch(attr.animchange, function(nv, ov) {
            if(nv != ov) {
                var c = nv === ov ? 'change-up' : 'change';
                $animate.addClass(elem, c).then(function() {
                    $timeout(function() {
                        $animate.removeClass(elem, c);
                    });
                });
            }
        });
    };
});

// app.directive("mdPermalink", function() {
//     return {
//         link: function($scope, elem, attr) {
//             elem.addClass("permalinkHeading");

//             function generatePermalink() {
//                 return "<img class=\"headingPermalink\" alt=\"permalink\" \
//                         src=\"/icons/link.svg\" \
//                         ng-click=\"console.log('aoe'); $state.go({'#': '" + attr.id + "'});\">";
//             }

//             elem.on("mouseover", function() {
//                 if(elem.find("img").length === 0)
//                     elem.append(generatePermalink());
//             });

//             elem.on("mouseleave", function() {
//                 if(elem.find("img").length !== 0)
//                     elem.find("img")[0].remove();
//             });
//         }
//     }
// });

app.filter("introFilter", function() {
    return function(x) {
        if(x !== undefined)
            return x.substring(0, x.indexOf("</p>"));
    }
});

app.filter("titleFilter", function($state) {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    return function(x) {
        if(x !== undefined)
            return x.capitalize() + " - Argarak's Nexus";
    }
});

app.filter('trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    }
}]);

app.controller("homeController", function($scope, $interval, $log, $http) {
    var self = this;
    self.articleIndex = 0;

    self.randColor = function() {
        function randInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var colors = [
            "#D32F2F",
            "#C2185B",
            "#7B1FA2",
            "#512DA8",
            "#303F9F",
            "#1976D2",
            "#0288D1",
            "#0097A7",
            "#00796B",
            "#388E3C",
            "#689F38",
            "#AFB42B",
            "#FBC02D",
            "#FFA000",
            "#F57C00",
            "#E64A19"
       ];
        return colors[randInt(0, colors.length - 1)];
    }

    $http.get("/articles.js").then(function(out) {
        self.out = out;
        $scope.title = out.data._wrapped[0].metadata.title;
        $scope.date = out.data._wrapped[0].metadata.date;
        $scope.intro = out.data._wrapped[0]._htmlraw;
        $scope.link = out.data._wrapped[0].filepath.relative.split("/")[1];
        $scope.color = self.randColor();
    }, function(out) {
        console.log("Failed to GET /article.js");
    });

    self.update = function(index) {
        $scope.title = self.out.data._wrapped[index].metadata.title;
        $scope.date = self.out.data._wrapped[index].metadata.date;
        $scope.intro = self.out.data._wrapped[index]._htmlraw;
        $scope.color = self.randColor();
    }

    self.updateNext = function() {
        $scope.determinateValue = 0;
        if(self.articleIndex === self.out.data._wrapped.length - 1)
            self.articleIndex = 0;
        else
            self.articleIndex++;
        self.update(self.articleIndex);
    }

    self.updatePrev = function() {
        $scope.determinateValue = 0;
        if(self.articleIndex === 0)
            self.articleIndex = self.out.data._wrapped.length - 1;
        else
            self.articleIndex--;
        self.update(self.articleIndex);
    }

    self.pauseval = 1;
    self.paused = false;

    self.pauseplay = function() {
        self.pauseval = self.pauseval === 1 ? 0 : 1;
        self.paused = !self.paused;
    }

    $scope.determinateValue = 0;
    $interval(function() {
         $scope.determinateValue += self.pauseval;
         if($scope.determinateValue > 100) {
             self.updateNext();
        }
    }, 70);
});

app.controller("blogController", function($scope, $timeout, $q, $log,
                                          $rootScope, $window, $state,
                                          $http) {
    var self = this;
    this.isDisabled = false;
    this.querySearch = querySearch;
    this.searchTextChange = searchTextChange;
    this.selectedItemChange = selectedItemChange;
    this.noCache = true;

    $scope.articles = {};

    $http.get("/articles.js").then(function(out) {
        $scope.articles = out.data;
        $scope.hideObject = new Object();
        for(var i = 0; i < out.data._wrapped.length; i++)
            $scope.hideObject[out.data._wrapped[i].metadata.title] = false;
    }, function(out) {
        console.log("Failed to GET /article.js");
    });

    var updateObject = function(name, query) {
        if(name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
            return false;
        } else {
            return true;
        }
    };

    function querySearch(query) {
        var articleObj = new Array();
        for(var i = 0; i < $scope.articles._wrapped.length; i++) {
            var tmpobj = new Object();
            tmpobj.value = $scope.articles._wrapped[i].metadata.title.toLowerCase();
            tmpobj.display = $scope.articles._wrapped[i].metadata.title;
            articleObj.push(tmpobj);
        }

        var results = query ? articleObj.filter(createFilterFor(query)) : articleObj,
            deferred;
        if(self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function searchTextChange(text) {
        $scope.tagname = undefined;
        for(var i = 0; i < Object.getOwnPropertyNames($scope.hideObject).length; i++) {
            var names = Object.getOwnPropertyNames($scope.hideObject);
            $scope.hideObject[names[i]] = updateObject(names[i], text);
        }
    }

    function selectedItemChange(item, urls) {
        var itemName = item.display
        var names = Object.getOwnPropertyNames($scope.hideObject);
        $state.go("blog", {
            name: urls[names.indexOf(itemName)]
                .substring(10, urls[names.indexOf(itemName)].length - 1)
        });
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        }
    }

    $scope.$watch("tagname", function(newValue, oldValue) {
        if(newValue !== undefined) {
            if(newValue === "All") {
                // All articles are shown
                for(var i in $scope.hideObject) {
                    $scope.hideObject[i] = false;
                }
            } else {
                // Hide articles according to tag
                for(var i in $scope.articles._wrapped) {
                    if($scope.articles._wrapped[i].metadata.tags !== newValue) {
                        $scope.hideObject[$scope.articles._wrapped[i].metadata.title] = true;
                    } else {
                        $scope.hideObject[$scope.articles._wrapped[i].metadata.title] = false;
                    }
                }
            }
        }
    });
});

app.controller("programsController", function($scope, $http) {
    var users = ["argarak", "mirpm"];
    var currentIndex = 0;
    
    $scope.method = "GET";
    //$scope.url = "https://api.github.com/users/argarak/repos";
    $scope.repo = '/icons/repo.svg';
    $scope.programsLoaded = 0;
    $scope.data = {};
    
    $scope.fetch = function() {
        for(var currentUser in users) {
            $scope.code = null;
            $scope.response = null;
    
            $http({method: $scope.method, 
                   url: "https://api.github.com/users/" + users[currentUser] + "/repos"}).
            then(function(response) {
                $scope.status = response.status;
                $scope.data[response.data[0].owner.login] = response.data;
                
                ++$scope.programsLoaded;
                ++currentIndex;
            }, function(response) {
                $scope.data[response.data[0].owner.login] = response.data || "Request failed";
                $scope.status = response.status;
                
                ++$scope.programsLoaded;
                ++currentIndex;
            });
        }
    }

    $scope.formatDate = function(date) {
        return date.replace(/[^\d.:-]/g, ' ');
    }
});

app.controller("microblogController", function($scope, $sce, $http) {
    $scope.image = "https://avatars0.githubusercontent.com/u/13645600?v=3&s=460";
    $scope.articlesLoaded = false;
    var self = this;

    // TODO use https://diasp.eu/people/671915105ab50132d4ed5404a6b20780/stream.json
    $scope.fetch = function() {
        var jsonUrl = "https://diasp.eu/people/671915105ab50132d4ed5404a6b20780/stream.json?format=json";
        $http({method: "GET", url: jsonUrl, headers: {'Content-Type':'application/x-www-form-urlencoded'}}).
        then(function(response) {
            console.log(response);
        }, function(response) {
            console.log("Error, failed to get JSON feed.", response)
        });
    }

    $scope.formatDate = function(date) {
        return date.replace(/[^\d.:-]/g, ' ');
    }
});

// Based of mdLightbox.js
app.directive("mdVideobox", ['$mdDialog', function($mdDialog) {
	  return {
		    link: function($scope, elem, attrs) {
			      elem.addClass('image-click');

		        elem.on('click', function() {
		    	      var video = attrs.src;
		    	      var title = attrs.alt;
		    	      showLightboxModal(video, title);
			      });

			      // Lightbox Modal
		        function showLightboxModal(video, title) {
		            var confirm = $mdDialog.confirm({
		                templateUrl: '/js/videobox.html',
		                clickOutsideToClose: true,
		                controller: videoboxController
		            });

		            $mdDialog.show(confirm);

		            function videoboxController($scope, $mdDialog) {
		        	      $scope.video = video;
		        	      $scope.title = title;

		                $scope.cancel = function() {
		                    $mdDialog.cancel();
		                };

		            }
		        }
		    }
	  }
}]);
