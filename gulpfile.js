//引入gulp
var gulp=require("gulp");
//合并文件所用的插件
var concat=require("gulp-concat");
//引入压缩文件所用的插件
var uglify=require("gulp-uglify");
//引入启动服务所需要的插件
var webserver=require("gulp-webserver");
//引入编译scss的插件
var sass=require("gulp-sass");
//引入压缩css的插件
var minify=require("gulp-minify-css");
//引入webpack
var webpack=require("gulp-webpack");
//引入重命名的插件
var named=require("vinyl-named");
//引入模板控制
var rev=require("gulp-rev");
var revCollector=require("gulp-rev-collector");
//引入node中的模块
var url=require("url");
var fs=require("fs");

//复制文件的一个任务
gulp.task("copy",function()
{
	gulp.src("./test/index.html")
		.pipe(gulp.dest("./app"))
})
//合并文件
gulp.task("branch",function()
{
	gulp.src(["./test/a.js","./test/b.js"])
		.pipe(concat("branch.js"))
		.pipe(gulp.dest("./get"))
})

//压缩文件
gulp.task("uglify",function()
{
	gulp.src("./test/iscroll.js")
		.pipe(uglify())
		.pipe(gulp.dest("./get"));
})
//启动服务
gulp.task("webserver",function()
{
	gulp.src("./")
		.pipe(webserver({
			port:80,
			livereload:true,//实现在网页上的同步刷新
			directoryListing:{//设置显示的列表
				enable:true,//是否显示
				path:"./"//从哪个文件夹下开始显示，， 路径
			},
			middleware:function(req,res,next)//mock数据
			{
				var urlObj=url.parse(req.url,true);
				switch(urlObj.pathname)
				{
					case "/api/getLivelist.php":
					res.setHeader("Content-type","application/json");
					fs.readFile("./app/mock/livelist.json","utf-8",function(err,data)
					{
						res.end(data);
					});
					return;
					case "/api/getLivelistmore.php":
					res.setHeader("Content-type","application/json");
					fs.readFile("./app/mock/livelist-more.json","utf-8",function(err,data)
					{
						res.end(data);
					});
					return;
				}
				next();
			}
		}))
})

//编译sass并且压缩
var sassFiles=["./app/src/styles/**/*.scss"];
gulp.task("sass",function()
{
	gulp.src(sassFiles)//读取要编译的scss文件
		.pipe(sass())//将scss文件编译为css文件
		.pipe(minify())//将css文件进行压缩
		.pipe(gulp.dest("./app/prd/styles"))//压缩后文件的存放路径
})
// 压缩css
var cssFiles=["./app/src/styles/*.css"];
gulp.task("css",function()
{
	gulp.src(cssFiles)
		.pipe(minify())
		.pipe(gulp.dest("./app/prd/styles"))
})
//实现js的模块化 gulp本身不具有，不能实现模块化
var jsFiles=["./app/src/scripts/app.js"];
gulp.task("packjs",function()
{
	gulp.src(jsFiles)//要实现模块化的js文件，
		.pipe(named())//重命名
		.pipe(webpack({//借助 webpack
			output:{
				filename:'[name].js'
			},
			modules:{
				loaders:[
					{
						test:/\.js$/,
						loader:'imports?define=>false'
					}					
				]
			}
		}))
		.pipe(uglify().on("error",function(e){
			console.log("\x07",e.lineNumber,e.message);
			return this.end();
		}))
		.pipe(gulp.dest("./app/prd/scripts"))//最终生成的js的存放位置
})

//版本控制
var cssDist=["./app/prd/styles/app.css"];
var jsDist=["./app/prd/scripts/app.js"];
gulp.task("ver",function()
{
	gulp.src(cssDist)
		.pipe(rev())  //生成md5加密格式的文件
		.pipe(gulp.dest("./app/prd/styles"))//将加密后的文件存放在此目录下
		.pipe(rev.manifest())//生成一个json文件 初始名：加密名
		.pipe(gulp.dest("./app/ver/styles"))
	gulp.src(jsDist)
		.pipe(rev())  //生成md5加密格式的文件
		.pipe(gulp.dest("./app/prd/scripts"))
		.pipe(rev.manifest())
		.pipe(gulp.dest("./app/ver/scripts"))
})

//HTML中引入的文件为md5加密的文件
gulp.task("html",function()
{
	gulp.src(["./app/ver/**/*.json","./app/*.html"])//需要读取的文件 json文件以及html文件
		.pipe(revCollector())//将原先的文件替换为经过md5加密的文件
		.pipe(gulp.dest("./app"))//讲得到最新的html文件防止到政务额的位置
})
gulp.task("min",["ver","html"]);
//检测文件
gulp.task("watch",function()
{
	gulp.watch("./test/index.html",["copy"]);
	gulp.watch("./test/*.js",["branch"]);
	gulp.watch(sassFiles,["sass"]);
	gulp.watch(cssFiles,["css"]);
	gulp.watch(jsFiles,["packjs"]);
})
gulp.task("default",["watch","uglify","webserver"]);




