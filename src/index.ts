/**
 * Module dependencies.
 */

import http from "http";
import process from "process";
import app from "./app";
declare const console;
/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
const port = 3000;

server.listen(port);
console.log("listening:3000");
/**
 * Event listener for HTTP server "error" event.
 */

server.on(
	"error",
	(error: { syscall: string; code: string }): void => {
		if (error.syscall !== "listen") {
			throw error;
		}

		const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

		// Handle specific listen errors with friendly messages
		switch (error.code) {
			case "EACCES":
				// eslint-disable-next-line no-console
				console.error(bind + " requires elevated privileges");
				process.exit(1);

				break;
			case "EADDRINUSE":
				// eslint-disable-next-line no-console
				console.error(bind + " is already in use");
				process.exit(1);

				break;
			default:
				console.error(error);
				throw error;
		}
	}
);
