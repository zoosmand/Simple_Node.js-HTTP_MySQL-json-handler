//Ver. 1.02.01.0261,  2020-08-04

const http  = require('http');
var params  = require('qs');
const mysql = require('mysql');

const mysqlData =
{
    host: 'localhost',
    port: 3306,
    user: 'crm',
    password: '********',
    database: 'crm2',
    multipleStatements: true
};

const connection = mysql.createConnection(mysqlData);

const _headers_ =
{
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':	'GET, POST',
    'X-Zoosman-Response-Handler': 'None'
};


const httpItem = http.createServer((request, response) =>
{
    const { headers, method, url } = request;
    let body = [];
    let queryData = params.parse(url.slice(2, url.length), true);
    let sqlRequest = queryData.sqlRequest;
    console.log(sqlRequest);
    
    /**
     * 
     * @param {*} error - contains an alarm message
     */
    let Error_Handler = function(error)
    {
        console.log(error);
        _headers_['X-Zoosman-Response-Handler'] = 'Error';
        response.writeHead(200, _headers_);
        response.end(JSON.stringify({ status: 'fail', message: error }));                    
    };
    
    /**
     * 
     * @param - no params
     */
    let dbPersistentConnect = function()
    {
        if(connection.state === 'disconnected')
        {
            connection.connect(function(error)
            {
                if (error) Error_Handler(error);
            });
        }
    };
       
    
    request
        .on('error', (error) => { console.error(error); })
        .on('data', (chunk) => { body.push(chunk); })
        .on('end', () =>
        {
            body = Buffer.concat(body).toString();
            response.on('error', (error) => { console.error(error); });

            /* keep connection alive */
            dbPersistentConnect();
    
            /**
             * 
             * @param {*} results - an array, contains a response from SQL request thet is got by the caller routine
             */
            let ReceivedData_Handler = function(results) {
                let $this = results[0];
                let resultJSON = '{"result":[';
                if ($this !== undefined)
                {
                    if ($this.length)
                    {
                        $this.forEach(element =>
                        {
                            element.each(function (key, val) 
                            {
                                element[key] = JSON.parse(val);
                            });
                            resultJSON += JSON.stringify(element) + ',';
                        });
                        resultJSON = resultJSON.slice(0, (resultJSON.length - 1));
                    }
                }
                resultJSON += ']}'; 
                _headers_['X-Zoosman-Response-Handler'] = 'OK';
                response.writeHead(200, _headers_);
                response.end(resultJSON);
            }

            // call callback handler
            Request_Handler(sqlRequest, ReceivedData_Handler, Error_Handler);
        });
});

httpItem.listen(8081, 'localhost' , () =>
{
    console.log('host %s:%d, socket(s) %d.', httpItem.address().address, httpItem.address().port, httpItem.getConnections.length);
});




/**
 * each iterator (callback) handler
 */
Object.prototype.each = function(callback)
{
    let counter = 0,
        keys = Object.keys(this),
        currentKey,
        len = keys.length,
        that = this,
        next = function()
        {
            if (counter < len)
            {
                currentKey = keys[counter++];
                callback(currentKey, that[currentKey]);
                next();
            } 
            else
            {
                that = counter = keys = currentKey = len = next = undefined;
            }
        };
    next();
};



/**
 * 
 * @param {*} request - a string, contains request text
 * @param {*} callback - a handler, which response is set up for
 * @param {*} errorCallback - a handler for errors
 */
function Request_Handler(request, callback, errorCallback)
{
    connection.query(request, function(error, result, fields)
    {
        if (error)
            errorCallback(error);
        else
            callback(result);
    });
}


