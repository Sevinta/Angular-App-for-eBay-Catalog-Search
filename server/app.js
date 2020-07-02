var express = require('express');
var bodyParser = require('body-parser');//body-parser
var request = require('request');
var app = express();
var port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });

app.use('/', (req, res) => {
    console.log(req.url)
    keywords = req.query.keywords
    pricefrom = req.query.minprice
    priceto = req.query.maxprice
    condition = req.query.condition
    seller = req.query.sellers
    shipping = req.query.shipping
    sortby = req.query.sort

    console.log(keywords,pricefrom,priceto,condition,seller,shipping,sortby)

    shipping_new = []
    for (i in shipping){
        if(i!=null){
            shipping_new.push(shipping[i])
        }
            
    }

    condition_new = []
    for (i in condition){
        if (condition[i] == "New"){
            condition_new.push("1000")
        }
        if (condition[i] == "Used"){
            condition_new.push("3000")
        }
        if (condition[i] == "Very Good"){
            condition_new.push("4000")
        }
        if (condition[i] == "Good"){
            condition_new.push("5000")
        }
        if (condition[i] == "Acceptable"){
            condition_new.push("6000")
        }
    }


    //console.log(keywords,pricefrom,priceto,condition_new,shipping_new,seller,sortby)

    var url1 ="https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=yuanjian-csci571h-PRD-32eba3d7e-0596553e&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords="+keywords+"&paginationInput.entriesPerPage=100&sortOrder="+sortby
    para = {}
    para["MinPrice"] = pricefrom
    para["MaxPrice"] = priceto
    para["Condition"] = condition_new
    para["ReturnsAcceptedOnly"] = seller
    para["shipping"] = shipping_new

    

    var count = 0
    if(para["MinPrice"]){
        url1 += "&itemFilter("+String(count)+").name=MinPrice&itemFilter("+String(count)+").value="+para["MinPrice"]+"&itemFilter("+String(count)+").paramName=Currency&itemFilter("+String(count)+").paramValue=USD"
        count +=1
    }

    if(para["MaxPrice"]){
        url1 += "&itemFilter("+String(count)+").name=MaxPrice&itemFilter("+String(count)+").value="+para["MaxPrice"]+"&itemFilter("+String(count)+").paramName=Currency&itemFilter("+String(count)+").paramValue=USD"
        count +=1
    }

    if(para["Condition"!='']){
        url1 += "&itemFilter("+count+").name=Condition"
        for (var i = 0; i < para["Condition"].length; i++ ){
            url1 += "&itemFilter("+String(count)+").value"+"("+String(i)+")="+para["Condition"][i]
        }
        count +=1
    }

    if(para["ReturnsAcceptedOnly"]){
        url1 += "&itemFilter("+String(count)+").name=ReturnsAcceptedOnly&itemFilter("+String(count)+").value=true"
        count +=1
    }

    if(para["shipping"!='']){
        if(para["shipping"].length == 2){
            url1 += "&itemFilter("+String(count)+").name=FreeShippingOnly&itemFilter("+String(count)+").value=true"
            count +=1
            url1 += "&itemFilter("+String(count)+").name=ExpeditedShippingType&itemFilter("+String(count)+").value=Expedited"
            count +=1
        }
    }else if(para["shipping"].length == 1 && para["shipping"] == "Free"){
        url1 += "&itemFilter("+String(count)+").name=FreeShippingOnly&itemFilter("+String(count)+").value=true"
    }else if(para["shipping"].length == 1 && para["shipping"] == "Expedited"){
        url1 += "&itemFilter("+String(count)+").name=ExpeditedShippingType&itemFilter("+String(count)+").value=Expedited"
    }


    console.log(url1)
    const options = {  
        url: url1,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
        }
    };

    request(options, function(err, response, body) {  
        var json = JSON.parse(body);
        //console.log(body); // Logging the output within the request function
        res.json(json) //then returning the response.. The request.json is empty over here
        res.end();
    }); //closing the request function    



    //res.end();
})
app.listen(port);
