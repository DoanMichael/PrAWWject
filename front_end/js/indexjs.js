
	var gifImgArray = ["1.gif","2.gif","3.gif","4.gif","5.gif","6.gif","7.gif","8.gif","9.gif","10.gif","11.gif","12.gif"];
	var num = Math.floor( Math.random() * 12);

	function getImageGif(imgAr, path) 
	{
		path = path || '../gifs/';
		
		var img = imgAr[num]
		var imgStr = '<img src="'+path+img + ' " height="500" width="600"">'
		document.write(imgStr); document.close()
	}

	var musicAr = ["89D2gmza6o8","Z2qLmgnl6Mg","ioULRchLwB0","WEMMVHAINFM","z8cwVLPt82w","kLp_Hh6DKWc","Y9ePLV6VHF0","6ISaCNLcsvM","3K2ly5Ioxf8","rVqAdIMQZlk","_Yv8P19pwlE","gxnvxtYfsd4"];
	var timeAr = ["0","77","35","54","10","55","3","1","0","25","33","19"];
	function getYT(ytid,timeStamp)
	{
		var musicID = ytid[num]
		var st = timeStamp[num]
		var ytStr = '<iframe id="player" type="text/html" width="0" height="1"src="http://www.youtube.com/embed/'+musicID+'?&autoplay=1&start='+st+'"frameborder="0"></iframe>'
		document.write(ytStr); document.close()
	}

