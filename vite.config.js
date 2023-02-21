const packageJSON = require('./package.json');
export default {
	root: 'src',
	build: {
		target: 'es2015',
		outDir: '../dist',
		rollupOptions: {
			output: {
				entryFileNames: "[name]_"+packageJSON.version+".js",
				chunkFileNames: "[name]_"+packageJSON.version+".js",
				assetFileNames: '[name]_'+packageJSON.version+'[extname]'
			}
		}
	}
}