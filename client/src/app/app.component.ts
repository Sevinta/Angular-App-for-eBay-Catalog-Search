import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {ChangeDetectionStrategy, Input} from "@angular/core";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'my-app';
  objectKeys = Object.keys;
  @Input('data') meals: string[] = [];
  page: number = 1;
  isShown2: boolean = false ; 
  isShown3: boolean = true ;
  hideme=[]
  key=""
  showf=[]
  heightd = []

  conditions = [
    {'name':'New', 'selected': false},
    {'name':'Used', 'selected': false},
    {'name':'Very Good', 'selected': false},
    {'name':'Good', 'selected': false},
    {'name':'Acceptable', 'selected': false}
];
  sellers = [
    {'seller_n':'Return Accepted', 'selected': false},
];
  shippings = [
    {'shipping_n':'Free', 'selected': false},
    {'shipping_n':'Expedited', 'selected': false},
];
postBack=[

]

   
validation(){
  var alert = document.getElementById('alertt');
  var alertt = document.getElementById('alertt2');
  var from_value = (<HTMLInputElement>document.getElementById('from')).value;
  var to_value = (<HTMLInputElement>document.getElementById('to')).value;
  var keywords =  (<HTMLInputElement>document.getElementById('keywords')).value;
  if(keywords==""){
    alert.style.display = "block"
  }
  if(Number(from_value) < 0 || Number(to_value) < 0 ||Number(from_value) > Number(to_value) && to_value!=""){ 
    if (alert.style.display == "block"){
      alertt.style.marginTop= "1%"
    }
    alertt.style.display = "block"
  
  }
 
}
declare user:{}
declare keyWords: "";
declare minprice:"";
declare maxprice:"";


onKey(event) {
  this.keyWords = event.target.value;
}
onmin(event){
  this.minprice = event.target.value;
}
onmax(event){
  this.maxprice = event.target.value;
}

oncond(){
  var date = document.getElementsByName("condition");
  var thisLength = date.length;
  var condition = new Array(5);
  for(var i = 0;i < thisLength;i++) {
      if ((<HTMLInputElement>date[i]).checked == true) {
          condition[i] = (<HTMLInputElement>date[i]).value;
          
      }
  }
  return condition
}

onseller(){
  var date = document.getElementById("seller");
  var seller = "";
  if ((<HTMLInputElement>date).checked == true) {
          seller = (<HTMLInputElement>date).value;
      }
  return seller
}

onshipping(){
  var date = document.getElementsByName("shipping");
  var thisLength = date.length;
  var shipping = new Array(2);
  for(var i = 0;i < thisLength;i++) {
      if ((<HTMLInputElement>date[i]).checked == true) {
          shipping[i] = (<HTMLInputElement>date[i]).value;
          
      }
  }
  return shipping
}

onsort(){
  var sort = (<HTMLSelectElement>document.getElementById('sort'));
  var selected_sort = sort.options[sort.selectedIndex].value   
  return selected_sort
}
constructor(private http: HttpClient) { }



add() {


  this.key = this.keyWords
  this.user ={ 
    keywords :this.keyWords, 
    minprice:this.minprice, 
    maxprice:this.maxprice,
    condition:this.oncond(),
    sellers:this.onseller(),
    shipping:this.onshipping(),
    sort:this.onsort()
  };
    console.log(this.user)
  const headers = new HttpHeaders()
        .set('Authorization', 'my-auth-token')
        .set('Content-Type', 'application/json');

  this.http.get(`https://jyjycsci571hw6-01.wl.r.appspot.com/?keywords=`+this.keyWords+"&pricefrom="+this.minprice+"&priceto="+this.maxprice+"&condition="+this.oncond()+"&seller="+this.onseller()+"&shipping="+this.onshipping()+"&sortby="+this.onsort(),  {
    headers: headers
  })
  .subscribe(data => {
    var result0 =data
    var rawData = result0['findItemsAdvancedResponse'][0]['searchResult'][0]['item']
    var count = result0['findItemsAdvancedResponse'][0]['paginationOutput'][0]['totalEntries'][0]
    var raw = rawData
    var result = []
  
    var counta = 0
    var alertt = document.getElementById('alertt3');

    if(result0['findItemsAdvancedResponse'][0]['searchResult'][0]["@count"] =="0"){
      alertt.style.display = "block"
    }  
    else{
    for(var i = 0;i < raw.length;i++ ){
        var dic={}
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
        dic["viewItemURL"] = raw[i]['viewItemURL'][0]
        dic['price'] =  "$"+raw[i]['sellingStatus'][0]['convertedCurrentPrice'][0]['__value__']
        dic['location'] = raw[i]['location'][0]
        dic["categoryName"] = raw[i]['primaryCategory'][0]['categoryName'][0]
        dic["condition"] = raw[i]['condition'][0]['conditionDisplayName'][0]
        dic['shippingType'] = raw[i]['shippingInfo'][0]['shippingType'][0]
        dic['shippingCost'] = raw[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__']
        dic["shipToLocations"] = raw[i]['shippingInfo'][0]['shipToLocations'][0]

        if(raw[i]['shippingInfo'][0]['expeditedShipping'][0]=='true'){
          dic['expeditedShipping'] = 'assets/done-24px.svg'
        }else if (raw[i]['shippingInfo'][0]['expeditedShipping'][0]=='false'){
          dic['expeditedShipping'] = 'assets/clear-24px.svg'
        }
        if(raw[i]['shippingInfo'][0]['oneDayShippingAvailable'][0]=='true'){
          dic['OneDayShippingAvailable'] = 'assets/done-24px.svg'
        }else if (raw[i]['shippingInfo'][0]['oneDayShippingAvailable'][0]=='false'){
          dic['OneDayShippingAvailable'] = 'assets/clear-24px.svg'
        }

        if(raw[i]['listingInfo'][0]['bestOfferEnabled'][0]=='true'){
          dic['BestOfferEnabled'] = 'assets/done-24px.svg'
        }else if (raw[i]['listingInfo'][0]['bestOfferEnabled'][0]=='false'){
          dic['BestOfferEnabled'] = 'assets/clear-24px.svg'
        }

        if(raw[i]['listingInfo'][0]['buyItNowAvailable'][0] =='true'){
          dic['BuyItNowAvailable'] = 'assets/done-24px.svg'
        }else if (raw[i]['listingInfo'][0]['buyItNowAvailable'][0] =='false'){
          dic['BuyItNowAvailable'] = 'assets/clear-24px.svg'
        }

      
        dic['ListingType'] = raw[i]['listingInfo'][0]['listingType'][0]

        if(raw[i]['listingInfo'][0]['gift'][0] =='true'){
          dic['Gift'] = 'assets/done-24px.svg'
        }else if (raw[i]['listingInfo'][0]['gift'][0] =='false'){
          dic['Gift'] = 'assets/clear-24px.svg'
        }

        
        dic['WatchCount'] = raw[i]['listingInfo'][0]['watchCount'][0]

                  
        if (raw[i]['galleryURL'] == undefined || raw[i]['galleryURL']=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
            dic['galleryURL'] = "https://csci571.com/hw/hw8/images/ebayDefault.png"
        }else{
            dic['galleryURL'] = raw[i]['galleryURL'][0]
        }
        result[counta] = dic
        counta += 1
      }

    for(var i = 0;i <result.length;i++){
      this.postBack[i] = {
          imgsrc:result[i].galleryURL,
          title:result[i].title,
          viewItemURL:result[i].viewItemURL,
          price:result[i].price,
          location:result[i].location,
          categoryName:result[i].categoryName,
          condition:result[i].condition,
          shippingType:result[i].shippingType,
          shippingCost:result[i].shippingCost,
          shipToLocations:result[i].shipToLocations,
          expeditedShipping:result[i].expeditedShipping,
          OneDayShippingAvailable:result[i].OneDayShippingAvailable,
          BestOfferEnabled:result[i].BestOfferEnabled,
          BuyItNowAvailable:result[i].BuyItNowAvailable,
          ListingType:result[i].ListingType,
          Gift:result[i].Gift,
          WatchCount:result[i].WatchCount

      };
      this.showf[i]="Show Details"
     
     if(document.getElementById('alertt').style.display=="block"||document.getElementById('alertt2').style.display=="block"||(document.getElementById('alertt').style.display=="block"&&document.getElementById('alertt2').style.display=="block")){
    document.getElementById('resulttt').style.display="none"
    return false
  }else{
    document.getElementById('resulttt').style.display="block"
    this.isShown2 = true;
  }
              
  }
  }
  });
}

del_div(){    
  document.getElementById('alertt').style.display="none"
  document.getElementById('alertt2').style.display="none"
  document.getElementById('resulttt').style.display="none"
  document.getElementById('alertt3').style.display="none"

  var sort = (<HTMLSelectElement>document.getElementById('sort')).options;
  sort[0].selected = true;
  (<HTMLFormElement>document.getElementById("submitForm")).reset();
  var result = document.getElementsByClassName("hahaha")
  for(var i = 0;i <result.length;i++){
    this.postBack[i] = {
        imgsrc:"",
        title:"",
        viewItemURL:"",
        price:"",
        location:"",
        categoryName:"",
        condition:"",
        shippingType:"",
        shippingCost:"",
        shipToLocations:"",
        expeditedShipping:"",
        OneDayShippingAvailable:"",
        BestOfferEnabled:"",
        BuyItNowAvailable:"",
        ListingType:"",
        Gift:"",
        WatchCount:""

    };

} }



isShown: boolean = false ; // hidden by default

toggleShow() {
this.isShown = ! this.isShown;
this.isShown3 = ! this.isShown3;
}

show(i){
 
  if (this.showf[i]=="Show Details"){
    this.showf[i]="Hide Details"
    this.heightd[i] = "20 rem"
  }
  else{
    this.showf[i]="Show Details"
    this.heightd[i] = "28 rem"
  }
}


}
