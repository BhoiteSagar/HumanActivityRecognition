var app = angular.module('myApp', ["highcharts-ng"]);

app.controller('MyCtrl', ['$scope', '$interval', '$timeout', '$http',
    function($scope, $interval, $timeout, $http) {
        $scope.resultData = [];
        $scope.actionType = [];
        $scope.actionCount = [];
        $scope.activityDistrubutionFlag = false;
        $scope.aboutFlag = false;
        $scope.homeFlag = true;
        $scope.activityPerDayFlag = false;
        $scope.chartType = "View Line Chart";
        $scope.title = "Dashboard";
        $scope.actionsMap = {
            "idle": 0,
            "Walking": 1,
            "Jogging": 2,
            "Sitting": 3,
            "Sleeping": 4,
            "Upstairs": 5,
            "Downstairs": 6,
            "Standing": 7
        }
        $scope.currentActionLabel = "idle";

        var activityDistrubutionInterval;

        //Pie chart start
        function getData() {
            $http.get('/chartData').success(function(data) {
                $scope.resultData = [];
                $scope.actionType.length = 0;
                $scope.actionCount.length = 0;
                for (var key in data) {
                    $scope.resultData.push([capitalizeEachWord(key), parseInt(data[key])]);
                    $scope.actionType.push(capitalizeEachWord(key));
                    $scope.actionCount.push(parseInt(data[key]));
                }
                //data for pie chart
                $scope.pieActions = $scope.resultData;

                //data for bar chart

            }).error(function(data) {
                console.log('Error: ' + data);
            });
        }

        function capitalizeEachWord(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
        //Pie chart end

        //Click Events
        $scope.activityDistrubution = function() {
            $scope.title = "Activity Distribution";
            getData();
            activityDistrubutionInterval = $interval(getData, 10000);
            $scope.activityDistrubutionFlag = true;
            $scope.aboutFlag = false;
            $scope.homeFlag = false;
            currentActionInterval = undefined;
        };

        $scope.home = function() {
            $scope.title = "Dashboard";
            $scope.activityDistrubutionFlag = false;
            $scope.aboutFlag = false;
            $scope.homeFlag = true;
            $scope.activityPerDayFlag = false;
            getCurrentAction();
            currentActionInterval = $interval(getCurrentAction, 3000);
            activityDistrubutionInterval = undefined;
        };
        $scope.home();

        $scope.userProfile = function() {
            $scope.title = "Profile";
            $scope.activityDistrubutionFlag = false;
            $scope.aboutFlag = false;
            $scope.homeFlag = false;
            $scope.activityPerDayFlag = false;
            activityDistrubutionInterval = undefined;
            currentActionInterval = undefined;
        };

        $scope.activityPerDay = function() {
            $scope.title = "Activity Per Day";
            $scope.activityDistrubutionFlag = false;
            $scope.aboutFlag = false;
            $scope.homeFlag = false;
            $scope.activityPerDayFlag = true;
            activityDistrubutionInterval = undefined;
            currentActionInterval = undefined;
        };

        $scope.health = function() {
            $scope.title = "Health";
            $scope.activityDistrubutionFlag = false;
            $scope.aboutFlag = false;
            $scope.homeFlag = false;
            $scope.activityPerDayFlag = false;
            activityDistrubutionInterval = undefined;
            currentActionInterval = undefined;
        };

        $scope.about = function() {
            $scope.title = "About";
            $scope.activityDistrubutionFlag = false;
            $scope.aboutFlag = true;
            $scope.homeFlag = false;
            $scope.activityPerDayFlag = false;
            activityDistrubutionInterval = undefined;
            currentActionInterval = undefined;
        };
        //Click Events

        function getCurrentAction() {
            $http.get('/currentAction').success(function(data) {
                $scope.actionSrc = "assets/gifs/" + data + ".gif";
                $scope.currentActionLabel = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        }

        //Bar chart start
        $scope.options = {
            type: 'column'
        }

        $scope.swapChartType = function() {
            if (this.highchartsNG.options.chart.type === 'line') {
                this.highchartsNG.options.chart.type = 'column';
                $scope.chartType = "View Line Chart";
            } else {
                this.highchartsNG.options.chart.type = 'line';
                $scope.chartType = "View Bar Chart";
            }
        }

        $scope.highchartsNG = {
            options: {
                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 0,
                        depth: 100,
                        viewDisatance: 25
                    }
                }
            },
            series: [{
                data: $scope.actionCount,
                name: "Activities"
            }],
            xAxis: {
                categories: $scope.actionType
            },
            title: {
                text: 'Activity Distribution'
            },
            plotOptions: {
                column: {
                    depth: 25
                }
            },
            loading: false
        }
        //Bar chart end

        //Spline chart start
        $scope.addPoints = function () {
            var seriesArray = $scope.chartConfig.series;
            var rndIdx = Math.floor(Math.random() * seriesArray.length);
            seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([$scope.actionsMap[$scope.currentActionLabel]]);
            seriesArray[rndIdx].name = capitalizeEachWord($scope.currentActionLabel);
            $timeout($scope.addPoints, 1000);
        };

        $scope.chartSeries = [
            {"name": capitalizeEachWord($scope.currentActionLabel), "data": [0]},
        ];

        $scope.chartConfig = {
            options: {
              chart: {
                type: 'spline'
              },
              plotOptions: {
                series: {
                  stacking: ''
                }
              }
            },
            series: $scope.chartSeries,
            title: {
              text: 'Current Activity'
            },
            credits: {
              enabled: true
            },
            loading: false,
            size: {}
        }

        $scope.addPoints();
        //Spline chart end

        //Activity per day start
        $scope.perhighchartsNG = {
            options: {
                chart: {
                    type: 'column'
                }
            },
            series: [{
                name: 'Walking',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6]
            }, {
                name: 'Running',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0]
            }, {
                name: 'Standing',
                data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0]
            }, {
                name: 'Sitting',
                data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4]
            }, {
                name: 'Sleeping',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0]
            }, {
                name: 'Ascending stairs',
                data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0]
            }, {
                name: 'Descending Stairs',
                data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4]
            }],
            title: {
                text: 'Activity Per Day'
            },
            xAxis: {
                categories: [
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                    'Sun'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            loading: false
        }
        //Activity per day end
    }
]);

app.directive('hcPie', function() {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            items: '='
        },
        controller: function($scope, $element, $attrs) {},
        template: '<div id="container" style="margin: 0 auto">not working</div>',
        link: function(scope, element, attrs) {

            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45
                    }
                },
                title: {
                    text: 'Activity Tracker'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>',
                    percentageDecimals: 2
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function() {
                                return '<b>' + this.point.name + '</b>: ' + parseFloat(this.percentage.toFixed(2)) + ' %';
                            }
                        },
                        innersize: 100,
                        depth: 45
                    }
                },
                series: [{
                    name: 'Activity Distrubution',
                    data: scope.items
                }]
            });
            scope.$watch("items", function(newValue) {
                chart.series[0].setData(newValue, true);
            }, true);
        }
    }
});