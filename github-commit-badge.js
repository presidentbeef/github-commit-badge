// github-commit-badge.js (c) 2008 by Johannes 'heipei' Gilger
//
// The source-code should be pretty self-explanatory. Also look at the 
// style.css to customize the badge.

function mainpage () {
Badges.each(function(badgeData) {

jQuery.getJSON("http://github.com/api/v1/json/" + badgeData["username"] + "/" + badgeData["repo"] 
	+ "/commit/" + badgeData["branch"] + "?callback=?", function(data) {
		
		var myUser = badgeData["username"];
		var myRepo = badgeData["repo"];
		var myEval = eval ( data );
		
		// outline-class is used for the badge with the border
		var myBadge = document.createElement("div");
		myBadge.setAttribute("class","github-commit-badge-outline");

		// the username/repo
		var myUserRepo = document.createElement("div");
		myUserRepo.setAttribute("class","github-commit-badge-username");

		var myLink = document.createElement("a");
		myLink.setAttribute("href","http://github.com/" + myUser + "/" + myRepo);
		myLink.setAttribute("class","github-commit-badge-username");
		myLink.appendChild(document.createTextNode(myUser + "/" + myRepo));
		myUserRepo.appendChild(myLink);

		// myDiffLine is the "foo committed xy on date" line 
		var myDiffLine = document.createElement("div");
		myDiffLine.setAttribute("class", "github-commit-badge-diffline");
		
		var myImage = document.createElement("img");
		myImage.setAttribute("src","http://www.gravatar.com/avatar/" + hex_md5(myEval.commit.committer.email) + "?s=60");
		myImage.setAttribute("class","github-commit-badge-gravatar");
		myDiffLine.appendChild(myImage);
		
		var myLink = document.createElement("a");
		myLink.setAttribute("href",myEval.commit.url);
		myLink.setAttribute("class", "github-commit-badge-badge");
		myLink.appendChild(document.createTextNode(" " + myEval.commit.id.truncate(10,"")));
		myDiffLine.appendChild(document.createTextNode(myEval.commit.committer.name + " "));
		var mySpan = document.createElement("span");
		mySpan.setAttribute("class","github-commit-badge-text");
		mySpan.appendChild(document.createTextNode("committed"));
		
		var myDate = document.createElement("span");
		myDate.setAttribute("class","github-commit-badge-text");
		var myParsedDate = Date.parse(myEval.commit.committed_date).toString("yyyy-MM-dd @ HH:mm");
		myDate.appendChild(document.createTextNode(myParsedDate));
		
		myDiffLine.appendChild(mySpan);
		myDiffLine.appendChild(myLink);
		myDiffLine.appendChild(document.createElement("span").appendChild(document.createTextNode(" on ")));
		myDiffLine.appendChild(myDate);
		
		// myCommitMessage is the commit-message
		var myCommitMessage = document.createElement("div");
		myCommitMessage.setAttribute("class", "github-commit-badge-commitmessage");
		myCommitMessage.appendChild(document.createTextNode("\"" + myEval.commit.message.truncate(100) + "\""));
		
		// myDiffStat shows how many files were added/removed/changed
		var myDiffStat = document.createElement("div");
		myDiffStat.setAttribute("class", "github-commit-badge-diffstat");
		myDiffStat.innerHTML = "(" + myEval.commit.added.length + " <span class=\"github-commit-badge-diffadded\">added<\/span>, " 
			+ myEval.commit.removed.length + " <span class=\"github-commit-badge-diffremoved\">removed<\/span>, " 
			+ myEval.commit.modified.length + " <span class=\"github-commit-badge-diffchanged\">changed<\/span>)";
		
		// throw everything into our badge
		myBadge.appendChild(myUserRepo);
		myBadge.appendChild(myDiffLine);
		myBadge.appendChild(myCommitMessage);
		myBadge.appendChild(myDiffStat);
		
		// and then the whole badge into the container
		var myContainer = document.getElementById("github-commit-badge-container");
		myContainer.appendChild(myBadge);
});
});
};

// libs we need (mind the order!)
var myLibs = ["everything"];

// For setting the loadpath correctly
var myScriptsDefs = document.getElementsByTagName("script");
for (var i=0; i < myScriptsDefs.length; i++) {
	if (myScriptsDefs[i].src && myScriptsDefs[i].src.match(/github-commit-badge\.js/)) {
		this.path = myScriptsDefs[i].src.replace(/github-commit-badge\.js/, '');
	};
};

// Loading the libs
for (var i=0; i < myLibs.length; ++i) {
	var myScript = document.createElement("script");
	myScript.setAttribute("type","text/javascript");
	myScript.setAttribute("src", this.path + "lib/" + myLibs[i] + ".js");
	if (i == myLibs.length-1) {	// timing problems
		myScript.setAttribute("onload","mainpage();");
	};
	document.getElementById("github-commit-badge-container").appendChild(myScript);
	if (myLibs[i] == "everything") {	// needed for using jQuery and prototype together
		var myScript = document.createElement("script");
		myScript.setAttribute("type","text/javascript");
		myScript.appendChild(document.createTextNode("jQuery.noConflict();"));
		document.getElementById("github-commit-badge-container").appendChild(myScript);
	};

};
// Write the stylesheet into the <head>
myHead = document.getElementsByTagName("head")[0];
myCSS = document.createElement("link");
myCSS.setAttribute("rel","stylesheet");
myCSS.setAttribute("type","text/css");
myCSS.setAttribute("href",this.path + "style.css");
myHead.appendChild(myCSS);
