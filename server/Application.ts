var restify = require("restify");

import ClientFileHandler from './handlers/ClientFileHandler'

/**
 * Back-end server class
 * 
 * @export Server class
 * @class Server
 */
export class Server {
	// The typing for restify is not very good, hence we accept any type for now
	private server: any;

	constructor() {
		var options = {
			name: 'Uber Code Challenge Server'
		};

		this.server = restify.createServer(options);

		this.server.use(restify.CORS());
		this.server.use(restify.fullResponse());
		this.server.use(restify.queryParser());

		this.registerHandlers();

		this.server.listen(80, () => {
			console.log('%s listening at %s', this.server.name, this.server.url);
		});
	}

	private registerHandlers() {

		
		// Client handlers
		this.server.get("/.*", restify.serveStatic({
			directory: './client',
			default: 'index.html'
		}));
	}
}