var login = login || {};
(function () {
    var loginbox = login.loginbox || (login.loginbox = {});

    loginbox.login = function (username, password, url,tenant) {
        $('#loginBtn').attr('disabled', true);
        jagg.post("/site/blocks/user/login/ajax/login.jag", { action:"login", username:username, password:password,tenant:tenant },
                 function (result) {
                     if (result.error == false) {
                         if (redirectToHTTPS && redirectToHTTPS != "" && redirectToHTTPS != "{}" &&redirectToHTTPS != "null") {
                             window.location.href = redirectToHTTPS;
                         } else if(url){
                             window.location.href = url;
                         }else{
                             window.location.reload();
                         }
                     } else {
                         $('#loginBtn').attr('disabled', false);
                         $('#loginErrorMsg').show();
                         $('#password').val('');
                         $('#loginErrorMsg div.theMsg').text(result.message).prepend('<strong>'+i18n.t("errorMsgs.login")+'</strong><br />');
                     }
                 }, "json");
    };

    loginbox.logout = function () {
        jagg.post("/site/blocks/user/login/ajax/login.jag", {action:"logout"}, function (result) {
            if (result.error == false) {
            	  window.location.href= requestURL + "?" + urlPrefix;
            } else {
                jagg.message({content:result.message,type:"error"});
                window.location.reload();
            }
        }, "json");
    };



}());


$(document).ready(function () {
    var registerEventsForLogin = function(){
        $('#mainLoginForm input').off();
         $('#mainLoginForm input').keydown(function(event) {
         if (event.which == 13) {
                var goto_url =$.cookie("goto_url");
                event.preventDefault();
                login.loginbox.login($("#username").val(), $("#password").val(), goto_url,$("#tenant").val());

            }
        });

        $('#loginBtn').off();
         $('#loginBtn').click(
            function() {
                var goto_url = $.cookie("goto_url");
                login.loginbox.login($("#username").val(), $("#password").val(), goto_url,$("#tenant").val());
            }
         );
    };
    var showLoginForm = function(event){
	if((ssoEnabled && ssoEnabled == 'true') || (oidcEnabled && oidcEnabled == 'true')){
		var targetLocation = $(this).attr('href');
		if(targetLocation == undefined){
		targetLocation = window.location.href;		
		//targetLocation = currentLocation;
		}
        var redirectURL = siteContext + '/site/pages/sso-filter.jag?passiveAuthRequired=false&requestedPage='+encodeURIComponent(targetLocation);
		window.location.href = redirectURL;	
	return false;
	}
        if(event != undefined){
            event.preventDefault();
        }
        if(!isSecure){
            $('#loginRedirectForm').submit();
            return;
        }

        $('#messageModal').html($('#login-data').html());
        $('#messageModal').modal('show');
        $.cookie("goto_url",$(this).attr("href"));
        $('#username').focus();

         registerEventsForLogin();
    };
    login.loginbox.showLoginForm = showLoginForm;


    $("#logout-link").click(function () {
        if (ssoEnabled=='true' || oidcEnabled=='true') {
            location.href = requestURL + '/site/pages/logout.jag';
        } else {
            login.loginbox.logout();
        }
    });

    $(".need-login").click(showLoginForm);
    $('#login-link').click(showLoginForm);

    if(isSecure && showLogin==true){
        showLogin = false;
        showLoginForm();
    }

});
//Theme Selection Logic
function applyTheme(elm){
    $('#themeToApply').val($(elm).attr("data-theme"));
    $('#subthemeToApply').val($(elm).attr("data-subtheme"));
    $('#themeSelectForm').submit();
}

function getAPIPublisherURL(){
    jagg.post("/site/blocks/user/login/ajax/login.jag", { action:"getAPIPublisherURL"},
        function (result) {
            if (!result.error) {
                    location.href = result.url;

            } else {
                jagg.message({content:result.message,type:"error"});
            }
        }, "json");
}



