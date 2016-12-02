module.exports={
	render:function(str)
	{
		var body=document.queryselector("body");
		body.innerhtml=str+body.innerhtml;
	}
}
