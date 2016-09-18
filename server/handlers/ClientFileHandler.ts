var restify = require("restify");

/**
 * Handler for client files. Serves static files.
 */
export default function getHandler(req: any, res: any, next: any) {
	console.log()
	return restify.serveStatic({
		directory: './client',
		default: 'index.html'
	});
}