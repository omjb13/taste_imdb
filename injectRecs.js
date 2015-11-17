function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function paintRecs(xhr_omdb, recname, rectype) {
	//http://www.omdbapi.com/?t=Goosebumps&y=&plot=short&r=json&type=movie
	
}


movieTitle = getElementByXpath("//h1[@class='header']/span[@class='itemprop']").textContent;

//returns either video.movie or video.tv_show. Tastekid expects either movie or show
contentType = getElementByXpath("//meta[@property='og:type']").attributes.getNamedItem('content').value;
contentType = contentType.split('.')[1];
if (contentType == "tv_show") {
	contentType = contentType.split('_')[1];
}

//https://www.tastekid.com/api/similar?q=pulp+fiction&k=177830-Experime-385NXDRM
var xhr = new XMLHttpRequest();
var req  = "https://www.tastekid.com/api/similar?q=" + contentType + ":" + encodeURI(movieTitle) + "&k=177830-Experime-LY6K4WGP&info=1&type=" + contentType + "s";
var recs = document.getElementById("titleRecs");
xhr.open("GET", req, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    resp = JSON.parse(xhr.responseText);
    receivedTitle = resp.Similar.Info[0].Name;
    receivedType = resp.Similar.Info[0].Type;
    recs.innerHTML = "<h2>Similar Titles</h2> <i>Powered By TasteKid<br/><br/></i>";
    //recs.innerHTML += receivedTitle + " (" + receivedType + ") from TasteKid!<br/><br/>";
    var results = resp.Similar.Results;
    xhr_omdb_array = new Array();
    for (var key in results)
    {
    	(function(key) {
	    	var recName = results[key].Name;
	    	var recType = results[key].Type;
	    	if (recType =='show') {
	    		recType = 'series';
	    	}
	    	xhr_omdb_array[key] = new XMLHttpRequest();
				req_omdb = "http://www.omdbapi.com/?plot=short&r=json&t=" + encodeURI(recName) + "&type=" + recType;
				xhr_omdb_array[key].open("GET", req_omdb, true);
				xhr_omdb_array[key].onreadystatechange = function() {
					if (xhr_omdb_array[key].readyState == 4) {
						resp_omdb = JSON.parse(xhr_omdb_array[key].responseText);
						if(!resp_omdb.hasOwnProperty('Error')){

							recs.innerHTML += `<b><a href="http://www.imdb.com/title/${resp_omdb.imdbID}">${resp_omdb.Title}</a></b> (${resp_omdb.Year}) <i>${resp_omdb.Genre}</i><br>`;
							recs.innerHTML += `<i>${resp_omdb.Actors}</i><br/>`;
							recs.innerHTML += `IMDB Score <b>${resp_omdb.imdbRating}</b> Metascore <b>${resp_omdb.Metascore}</b><br/>`;
							recs.innerHTML += resp_omdb.Plot + "<br/>";
							recs.innerHTML += "<br/>";
							recs.innerHTML += "<br/>";
						}
					}
				}
				xhr_omdb_array[key].send();
	    })(key);
  	}
	}
}
xhr.send();