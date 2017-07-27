const webpack=require("webpack");
const ExtractTextPlugin=require("extract-text-webpack-plugin")
module.exports={
	entry:"./src/index.js",
	output:{
		//path:'./build',
		path:"D:/test/tomato/build",
		filename:"crp.js"
	},
	module:{
		rules: [
			      {
			        test: /\.vue$/,
			        loader: 'vue-loader',
			        options: {
			          loaders: {
			            css: ExtractTextPlugin.extract({
			              use: 'css-loader',
			              fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
			            }),
			            js:'babel-loader?presets[]=es2015',
			
			          }
			        }
			      },
			      {
				      	test:/\.js$/,
				      	exclude: /(node_modules|bower_components)/,
						loader:"babel-loader?presets[]=es2015",
      				},
				{test:/\.css$/,use:ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract({
						use: [{
		                    loader: "css-loader"
		                }, {
		                    loader: "sass-loader"
		                }],
		                // use style-loader in development
		                fallback: "style-loader"
					})},
				{
					test:/\.(png|jpg|gif)$/,
					loader:"url-loader?limit=8192 &name=img/[name][hash:8].[ext]"
				}
			    
			    ]
	},
	plugins: [
        new ExtractTextPlugin("styles.css"),
        /*new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        warnings: false
	      }
	    })*/
    ]
}