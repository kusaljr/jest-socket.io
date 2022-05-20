import {createServer, Server} from 'http'
import { Server as SocketServer, Socket } from 'socket.io'

export const server = createServer()




export function socketServer(httpServer: Server){
    const io:SocketServer = new SocketServer(httpServer, {})
    io.use((socket: Socket, next) => {
		try {
			const token = socket.handshake.auth.token;
			if(token === "INVALID_TOKEN"){
				throw(Error("invalid token"))
			}else{
				next();
			}
		} catch (e) {
			next(new Error("invalid token"))
			socket.emit("error", "error happenend")
			socket.disconnect();
		}
	}).on("connection", function (socket: Socket) {
		socket.on('send_nudes', async function (data: any) {
			if (data.secret === 'SECRET_TOKEN') {
				io.emit('receive_nudes', 'Sending Nudes to all connection');
			}
		});
})
return io
}
