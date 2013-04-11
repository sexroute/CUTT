var __gCuttDebug = true;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab)
{
    if (changeInfo.status == 'complete' && tab.url.search(/^chrome/i) == -1)
    {

    }
});

chrome.browserAction.onClicked.addListener(function (tab)
{

});

// listen 從 content scripts 傳來的 requests
chrome.extension.onRequest.addListener(function (request, sender, sendResponse)
{
    if (request.purpose == 'check_login')
    {
        chrome.cookies.get(
        {
            url: "http://*.cutt.com/",
            name: "uid"
        }, sendResponse);
    }
    else if (request.purpose == 'shareToCutt')
    {
        chrome.tabs.getSelected(null, function (currentTab)
        {
            if (currentTab && typeof (currentTab) != "undefined")
            {
                var lstrUrl = currentTab.url;

            }
        });
    }
    else if (request.purpose == 'navigateToCutt')
    {

    }

});

function GetColumns(astrAppID)
{
    $.ajax(
    {
        url: "http://zhiyue.cutt.com/api/app/columns",
        type: 'GET',
        dataType: 'html',
        timeout: 20000, //超时时间设定
        error: function ()
        {
            ShowSettingResult(false);
        }, //错误处理，隐藏进度条
        success: function (html)
        {
            try
            {
                var loData = $.parseJSON(html);
                if (loData.length > 0)
                {
                    localStorage["columns"] = html;
                    InitUI();
                    showResult(true);
                }
                else
                {
                    showResult(false, html);
                }

            }
            catch (e)
            {
                showResult(false, html);
            }
        },
        beforeSend: function (jqXHR, settings)
        {
            jqXHR.setRequestHeader("app", astrAppID);
        }
    });
}

function NavigateToCutt()
{
    chrome.tabs.create(
    {
        'url': 'http://www.cutt.com'
    });
}

function CheckLogin(obj)
{
    if (__gCuttDebug)
    {
        console.log(obj);
    }
    if (null == obj || typeof (obj) == "undefined")
    {
        NavigateToCutt();
    }
}

function showResult(abSucceed, astrHTML)
{
    return;
    var lstrMsgID = CreateFloatDiv();
    if (lstrMsgID.length > 0)
    {
        var lstrResult = "";
        if (abSucceed)
        {
            lstrResult = "operate succeed";
        }
        else
        {
            lstrResult = "operate failed, reason:" + astrHTML;
        }
        $(lstrMsgID).HTML = lstrResult;
    }
}

function CreateFloatDiv()
{
    var g_MsgID = "__17_47_infoTipdiv";
    var loObj = document.getElementById(g_MsgID);
    if (null == loObj || typeof (loObj) == "undefined")
    {
        var div = document.createElement("div");
        div.style.position = "fixed";
        div.style.top = "1em";
        div.style.right = "1em";
        div.id = g_MsgID;
        document.body.appendChild(div);
        loObj = document.getElementById(g_MsgID);
        if (null == loObj || typeof (loObj) == "undefined")
        {
            return "";
        }
    }

    return g_MsgID;
}

function sendToCutt(astrUrl, info)
{
    var favorite = info.menuItemId;
    //1.check login
    chrome.cookies.get(
    {
        url: "http://*.cutt.com/",
        name: "uid"
    }, CheckLogin);
    para = "clipId=" + favorite + "&url=" + encodeURIComponent(astrUrl);
    console.log(para);
    $.ajax(
    {
        url: "http://www.cutt.com/imp/save",
        type: 'POST',
        dataType: 'html',
        timeout: 20000, //超时时间设定
        data: para, //参数设置
        error: function ()
        {
            //apCallBack(false);
        }, //错误处理，隐藏进度条
        success: function (html)
        {
            //apCallBack(html);
        }
    });
}

// Create some radio items.

function OnBtnClick(info, tab)
{
    var lstrUrl = tab.url;
    sendToCutt(lstrUrl, info);
}

function OnBtnGoToSetup()
{
    var lstrUrl = chrome.extension.getURL("options.html");
    chrome.tabs.create(
    {
        'url': "pages/options.html"
    });
}

function refreshColumns()
{
    var lstrCateId = localStorage["cat_id"];
    GetColumns(lstrCateId);
}

function InitUI()
{
    chrome.contextMenus.removeAll();
    var lstrHTML = "";
    try
    {
        lstrHTML = $.parseJSON(localStorage["columns"]);
        if (lstrHTML == null || typeof (lstrHTML) == "undefined")
        {
            lstrHTML = "";
        }
    }
    catch (e)
    {
        lstrHTML = "";
    }

    if (lstrHTML.length != 0)
    {
        for (i = 0; i < lstrHTML.length; i++)
        {
            var lstrName = lstrHTML[i].name;
            var lstrAppID = lstrHTML[i].itemId;
            var lstrTitle = "分享到简网栏目:" + lstrName;
            var radio1 = chrome.contextMenus.create(
            {
                "title": lstrTitle,
                "id": lstrAppID + "",
                "type": "normal",
                "contexts": ["all"],
                "onclick": OnBtnClick
            });
        }
        radio1 = chrome.contextMenus.create(
        {
            "title": "separator",
            "id": "0000",
            "type": "separator",
            "contexts": ["all"],
        });
        radio1 = chrome.contextMenus.create(
        {
            "title": "刷新栏目列表",
            "id": "refreshColumns",
            "type": "normal",
            "contexts": ["all"],
            "onclick": refreshColumns
        });
        radio1 = chrome.contextMenus.create(
        {
            "title": "简网设置分享",
            "id": "OnBtnGoToSetup",
            "type": "normal",
            "contexts": ["all"],
            "onclick": OnBtnGoToSetup
        });
    }
}

InitUI();