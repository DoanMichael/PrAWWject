		function getYT(ytid,timeStamp){
			var musicID = ytid[num]
			var st = timeStamp[num]
			var ytStr = '<iframe id="player" type="text/html" width="0" height="1"src="http://www.youtube.com/embed/'+musicID+'?&autoplay=1&start='+st+'"frameborder="0"></iframe>'
			document.write(ytStr); document.close()
		}
