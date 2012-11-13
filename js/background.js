var __gCuttDebug = true;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) 
{
    if (changeInfo.status == 'complete' && tab.url.search(/^chrome/i) == -1) 
    {

    }
});

chrome.browserAction.onClicked.addListener(function(tab) 
{

});

// listen 從 content scripts 傳來的 requests
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) 
{
    if (request.purpose == 'check_login')
    {
    	 chrome.cookies.get({url:"http://*.cutt.com/",name:"uid"}, sendResponse);
    }
    else if(request.purpose == 'shareToCutt')
    {
    	  chrome.tabs.getSelected
    	  (null,
    	  	function(currentTab)
    	  	{
    	  		if(currentTab&&typeof(currentTab)!="undefined")
    	  		{
    	  			var lstrUrl = currentTab.url; 		
    	  		
    	  		}
    	  	} 
    	  );
    }else if(request.purpose == 'navigateToCutt')
    {
    	
    }
   
});
function NavigateToCutt()
{
	chrome.tabs.create({'url': 'http://www.cutt.com'});
}
function CheckLogin(obj)
{
	if(__gCuttDebug)
	{
		console.log(obj);
	}
	if(null==obj || typeof(obj)=="undefined")
	{
		NavigateToCutt();
	}
}
function sendToCutt(astrUrl,apCallBack)
{
	 var favorite = localStorage["cat_id"];
	chrome.cookies.get({url:"http://*.cutt.com/",name:"uid"}, CheckLogin);
	para = "clipId="+favorite+"&url="+encodeURIComponent(astrUrl);
	console.log(para);
	$.ajax({
    url: "http://www.cutt.com/imp/save",
    type: 'POST',
    dataType: 'html',
    timeout: 20000,//超时时间设定
    data:para,//参数设置
    error: function()
    {
    	//apCallBack(false);
    },//错误处理，隐藏进度条
	  success: function(html)
	  {
	    //apCallBack(html);
	  }
	});
}




// Create some radio items.
function OnBtnClick(info, tab) 
{
  var lstrUrl = tab.url;
  sendToCutt(lstrUrl,null);
}

var radio1 = chrome.contextMenus.create({"title": "分享到简网", "type": "normal","contexts":["all"],
                                         "onclick":OnBtnClick});



