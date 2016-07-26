hljs.initHighlightingOnLoad();

var app = angular.module("nexus", ["ngMaterial", "ngAnimate", "mdLightbox", "truncate"])
                 .config(function($mdThemingProvider) {
                     $mdThemingProvider.theme('default')
                                       .primaryPalette("red")
                                       .accentPalette("pink")
                                       .dark();
                     $mdThemingProvider.theme('light')
                                       .primaryPalette("red")
                                       .accentPalette("pink");
                 });

app.controller("mainController", function($scope, $mdSidenav, $mdDialog) {
    $scope.openLeftMenu = function() {
        $mdSidenav("left").toggle();
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
});

app.controller("indexGreeting", function($scope) {
    $scope.getGreeting = function() {
        var d = new Date();
        var hrs = d.getHours();

        if(hrs >= 6 && hrs < 12) {
            return "Good Morning";
        } else if(hrs >= 12 && hrs < 18) {
            return "Good Afternoon";
        } else if(hrs >= 18 && hrs < 21) {
            return "Good Evening";
        } else {
            return "Good Night";
        }
    }
});

app.controller("getMonth", function($scope) {
    $scope.getMonth = function(index) {
        var months = ["January", "February", "March",
                      "April", "May", "June", "July",
                      "August", "September", "October",
                      "November", "December"];
        return months[index];
    }
});

app.controller("blogController", function($scope, $timeout, $q, $log, $rootScope, $window) {
    var self = this;
    this.isDisabled = false;
    this.querySearch = querySearch;
    this.searchTextChange = searchTextChange;
    this.selectedItemChange = selectedItemChange;
    this.noCache = true;

    $scope.hideObject = new Object();

    $scope.createHideObject = function(articleTitles) {
        for(var i = 0; i < articleTitles.length; i++)
            $scope.hideObject[articleTitles[i]] = false;
    }

    var updateObject = function(name, query) {
        if(name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
            return false;
        } else {
            return true;
        }
    };

    function querySearch(query, articleTitles) {
        var articleObj = new Array();
        for(var i = 0; i < articleTitles.length; i++) {
            var tmpobj = new Object();
            tmpobj.value = articleTitles[i].toLowerCase();
            tmpobj.display = articleTitles[i];
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
        for(var i = 0; i < Object.getOwnPropertyNames($scope.hideObject).length; i++) {
            var names = Object.getOwnPropertyNames($scope.hideObject);
            $scope.hideObject[names[i]] = updateObject(names[i], text);
        }
    }

    function selectedItemChange(item, urls) {
        var itemName = item.display
        var names = Object.getOwnPropertyNames($scope.hideObject);
        $window.location.href = urls[names.indexOf(itemName)];
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        }
    }
});

app.controller("microblogController", function($scope) {
    $scope.get = function() {
        var url = 'https://pump2rss.com/feed/argarak@pumpyourself.com.atom';
        feednami.load(url, function(result) {
            if(result.error) {
                console.log(result.error);
            } else {
                for(var i = 0; i < result.feed.entries.length; i++) {
                    if(result.feed.entries[i].description != null &&
                       result.feed.entries[i].description != "<a href='https://pumpyourself.com/argarak'>argarak</a> deleted a note" &&
                       result.feed.entries[i].description != "<a href='https://pumpyourself.com/argarak'>argarak</a> deleted an image") {
                     
                    }
                }
            }
        });

    }
});

/* app.directive('CustomDirective', function(){
 *     return {
 *         restrict:  'E',
 *         link: function(scope, element, attrs){
 *             scope.$watch('invoice_html_template', function(){
 *                 var template = scope.invoice_html_template;
 *                 element.html(template);
 *                 $compile(element.contents())(scope);
 *             });
 *         },
 *         template: '<div>{{$scope.invoiceTemplate}}</div>'
 *     }
 * });*/
