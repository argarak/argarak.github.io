
var app404 = angular.module("app404", ["ngConsole"]);

app404.controller("consoleController", function($scope) {
    $scope.options = {};
    $scope.options.fixed = true;
    $scope.options.fullscreen = true;
    $scope.options.open = true;
    $scope.options.customHeight = 350;
    $scope.options.customPrefix = "[ramfs /]# ";
    $scope.options.customTheme = {
        name: "nexus",
        data: {
            bg: "#111",
            color: "#bbb",
            boldColor: "#E91E63",
            fontsize: 16,
            fontfamily: "monospace"
        },
        labels: {
            bg: "Dark Gray",
            color: "Light gray",
            boldColor: "Pink"
        }
    };

    // This will make these commands available for users.
    $scope.options.customCommands = [
        {
            name: 'home',
            description: 'Takes you back to the home page.',
            params: false,
            action: function(printLn, params) {
                window.location = "/";
            }
        }
    ];
});
