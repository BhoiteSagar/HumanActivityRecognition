var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request');
var app = express();

var cassandra = require('cassandra-driver');
var client = new cassandra.Client({
    contactPoints: ['104.197.95.54'],
    keyspace: 'activityrecognition'
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/chartData', function(req, res) {
    var actionsWithCount = "";
    // Read data and print to console
    client.execute("select group_and_count(prediction) from result", function(err, result) {
        if (!err) {
            if (result.rows.length > 0) {
                var data = result.rows[0];
                for (x in data) {
                    actionsWithCount = data[x];
                    break;
                }
                res.send(actionsWithCount);
            } else {
                console.log("No results");
            }
        }
    });
});

app.get('/currentAction', function(req, res) {
    // Read data and print to console
    client.execute("select * from result where user_id='TEST_USER' order by timestamp desc LIMIT 1;", function(err, result) {
        if (!err) {
            if (result.rows.length > 0) {
                var data = result.rows[0];
                res.send(data.prediction);
            } else {
                console.log("No results");
            }
        }
    });
});

var server = app.listen(process.env.PORT || 5000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});