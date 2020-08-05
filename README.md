# Simple_Node.js-HTTP_MySQL-json-handler
A simple handler for data json response from MySQL via HTTP GET request


This is a simple example of node.js HTTP handler. Sending a request like this:
http://localhost:8082?sqlRequest=CALL SELECT_customer_type(0)
you will get a json response like that:
	


{"result": [
  {
    "customerTypeUid": {"value": 10},
    "customerTypeName": {"value": "Private"},
    "customerTypeDescription": {"value": "A private customer."},
    "scrollAttributes": {}
  }
  , {
    "customerTypeUid": {"value": 11},
    "customerTypeName": {"value": "Company"},
    "customerTypeDescription": {"value": "An organization as a customer. Usually it uses high speed broadband."},
    "scrollAttributes":{}
  }
  , {
    "customerTypeUid": {"value": 22},
    "customerTypeName": {"value": "Special"},
    "customerTypeDescription": {"value": "An unusual customer with customized demands."},
    "scrollAttributes":{}
  }
]}


