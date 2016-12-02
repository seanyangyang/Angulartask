var commonUtil=require("../common/common.js");
angular.module("myApp",[])
	.controller("sort",["$scope",function($scope)
	{
		var people=[
			{
				firstname:"Williams",
				lastname:"john",
				salary:"18000",
				birthday:"1996-04-20"
			},
			{
				firstname:"Garcia",
				lastname:"sarah",
				salary:"15000",
				birthday:"1995-06-02"
			},
			{
				firstname:"Jones",
				lastname:"david",
				salary:"20000",
				birthday:"1997-09-25"
			},
			{
				firstname:"Jones",
				lastname:"lily",
				salary:"21000",
				birthday:"1998-03-04"
			}
		]
		$scope.people=people;
		$scope.firstName="";
		$scope.field="firstname";
		$scope.searchFirst=function(obj)
		{
			if($scope.firstName!="")
			{
				if(obj.firstname.toLowerCase().indexOf($scope.firstName)!=-1)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				return true;
			}
			
		}

		$scope.sort=function(event,text)
		{
			var el=event.path[0].firstElementChild
			//console.log($(event.path[0].firstElementChild).parent())
			$(el).parent().siblings().find("span").removeClass();
			if(el.className=="" || el.className=="down")
			{
				el.className="up";
				$scope.field=text;
			}
			else if(el.className=="up")
			{
				el.className="down";
				$scope.field=-text;
			}

		}
	}])

