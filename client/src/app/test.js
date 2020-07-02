var app = angular.module('myApp',[]);
      app.controller('formCtrl', ["$scope",'$http',function ($scope,$http) {
        $scope.myform={};
        $scope.conditions = [
            {'name':'New', 'selected': false},
            {'name':'Used', 'selected': false},
            {'name':'Very Good', 'selected': false},
            {'name':'Good', 'selected': false},
            {'name':'Acceptable', 'selected': false}
        ];

        $scope.sellers = [
            {'seller_n':'Return Accepted', 'selected': false},
        ];

        $scope.shippings = [
            {'shipping_n':'Free', 'selected': false},
            {'shipping_n':'Expedited', 'selected': false},
        ];
            
        $scope.selected_conditions = [];
        $scope.selected_sellers = [];
        $scope.selected_shippings = [];
        

        $scope.add = function(prod){
            var index = $scope.selected_conditions.indexOf(prod.name);
            if(index == -1 && prod.selected && prod.name!=undefined){
                $scope.selected_conditions.push(prod.name);
            } else if (!prod.selected && index != -1){
                $scope.selected_conditions.splice(index, 1);
            }

            var index2 = $scope.selected_sellers.indexOf(prod.seller_n);
            if(index2 == -1 && prod.selected && prod.seller_n!=undefined){
                $scope.selected_sellers.push(prod.seller_n);
            } else if (!prod.selected && index2 != -1){
                $scope.selected_conditions.splice(index2, 1);
            }

            var index3 = $scope.selected_shippings.indexOf(prod.shipping_n);
            if(index3 == -1 && prod.selected && prod.shipping_n!=undefined){
                $scope.selected_shippings.push(prod.shipping_n);
            } else if (!prod.selected && index3 != -1){
                $scope.selected_shippings.splice(index3, 1);
            }
           
        }

        $scope.download = function (){
            
            if ($scope.myform.keyWords==undefined){
                var alertt = document.getElementById("alertt")
                alertt.style.display="block"
            }
            if (Number($scope.myform.min) < 0|| Number($scope.myform.max) < 0|| (Number($scope.myform.min) > Number($scope.myform.max) && $scope.myform.max!="")){
                var alertt2 = document.getElementById("alertt2")
                alertt2.style.display="block"
            }

            var sort = document.getElementById('sort');
            selected_sort = sort.options[sort.selectedIndex].value 

            $http({
            method:'GET',
            url:'http://127.0.0.1:2000/',
            params:{
                keywords : $scope.myform.keyWords,
                minprice : $scope.myform.min,
                maxprice : $scope.myform.max,
                condition:  $scope.selected_conditions,
                sellers : $scope.selected_sellers,
                shipping : $scope.selected_shippings,
                sort : selected_sort
            },
          
        },
   
        ).then(function (response) {
             //console.log(response.data)
             const result0 = JSON.parse(response.data)
             //console.log(typeof(result0))
             rawData = result0['findItemsAdvancedResponse'][0]['searchResult'][0]['item']
             count = result0['findItemsAdvancedResponse'][0]['paginationOutput'][0]['totalEntries'][0]
             raw = rawData

             var result = []
             //console.log(raw)
             counta = 0
             for(var i = 0;i < raw.length;i++ ){
                dic={}
                if(raw[i]['title'] ==undefined ||raw[i]['sellingStatus'][0]['convertedCurrentPrice']==undefined
                ||raw[i]['location']==undefined||raw[i]['primaryCategory'][0]['categoryName']==undefined
                ||raw[i]['condition']==undefined||raw[i]['shippingInfo'][0]['shippingType']==undefined
                ||raw[i]['shippingInfo'][0]['shippingServiceCost']==undefined||raw[i]['shippingInfo'][0]['shipToLocations']==undefined
                ||raw[i]['shippingInfo'][0]['expeditedShipping']==undefined||raw[i]['shippingInfo'][0]['oneDayShippingAvailable']==undefined
                ||raw[i]['listingInfo'][0]['bestOfferEnabled']==undefined||raw[i]['listingInfo'][0]['buyItNowAvailable']==undefined
                ||raw[i]['listingInfo'][0]['listingType']==undefined||raw[i]['listingInfo'][0]['gift']==undefined
                ||raw[i]['listingInfo'][0]['watchCount']==undefined
                )
            {
                continue;
            }
                dic["title"] = raw[i]['title'][0]
                dic['price'] =  "$"+raw[i]['sellingStatus'][0]['convertedCurrentPrice'][0]['__value__']
                dic['location'] = raw[i]['location'][0]
                dic["categoryName"] = raw[i]['primaryCategory'][0]['categoryName'][0]
                dic["condition"] = raw[i]['condition'][0]['conditionDisplayName'][0]
                dic['shippingType'] = raw[i]['shippingInfo'][0]['shippingType'][0]
                dic['shippingCost'] = raw[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__']
                dic["shipToLocations"] = raw[i]['shippingInfo'][0]['shipToLocations'][0]
                dic['expeditedShipping'] = raw[i]['shippingInfo'][0]['expeditedShipping'][0]
                dic['OneDayShippingAvailable'] = raw[i]['shippingInfo'][0]['oneDayShippingAvailable'][0]
                dic['BestOfferEnabled'] = raw[i]['listingInfo'][0]['bestOfferEnabled'][0]
                dic['BuyItNowAvailable'] = raw[i]['listingInfo'][0]['buyItNowAvailable'][0] 
                dic['ListingType'] = raw[i]['listingInfo'][0]['listingType'][0]
                dic['Gift'] = raw[i]['listingInfo'][0]['gift'][0]
                dic['WatchCount'] = raw[i]['listingInfo'][0]['watchCount'][0]


                
                if (raw[i]['galleryURL'] == undefined || raw[i]['galleryURL']=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
                    dic['galleryURL'] = "https://csci571.com/hw/hw8/images/ebayDefault.png"
                }else{
                    dic['galleryURL'] = raw[i]['galleryURL'][0]
                }
                result[counta] = dic
                counta += 1
            }
            console.log(result)


        }, function (response) {
            // 请求失败执行代码
        });

        }
      }]);