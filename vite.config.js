const packageJSON = require('./package.json');
export default {
	root: 'src',
	build: {
		target: 'es2015',
		outDir: '../dist',
		rollupOptions: {
			output: {
				entryFileNames: "jshare_"+packageJSON.version+".js",
				assetFileNames: 'jshare_'+packageJSON.version+'[extname]'
			}
		}
	}
}