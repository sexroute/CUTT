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
function sendToCutt(astrUrl,info)
{
	var favorite = info.menuItemId ;
	//1.check login
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
  sendToCutt(lstrUrl,info);
}

function OnBtnGoToSetup()
{
	var lstrUrl = chrome.extension.getURL("options.html");
	chrome.tabs.create({'url': "pages/options.html"});
}
function InitUI()
{
	var lstrHTML = "";
	try
	{
	 lstrHTML = $.parseJSON(localStorage["columns"]);
	 if(lstrHTML== null || typeof(lstrHTML)=="undefined")
	 {
	 	lstrHTML = "";
	 }
	}catch(e)
	{
		lstrHTML = "";
	}
	
	if(lstrHTML.length==0)
	{
			var radio1 = chrome.contextMenus.create({"title": "简网设置分享", "type": "normal","contexts":["all"],
                                         "onclick":OnBtnGoToSetup});
	}else
	{
		for(i = 0;i< lstrHTML.length;i++)
		{
			var lstrName = lstrHTML[i].name;
			var lstrAppID = lstrHTML[i].itemId;
			var lstrTitle = "分享到简网栏目:"+lstrName;
			var radio1 = chrome.contextMenus.create({"title": lstrTitle,"id":lstrAppID+"", "type": "normal","contexts":["all"],
                                         "onclick":OnBtnClick});
		}
	}
}

InitUI();





