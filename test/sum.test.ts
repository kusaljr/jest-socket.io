// with { "type": "module" } in your package.json
import { createServer } from "http";
import { io as Client, Socket } from "socket.io-client";
import {AddressInfo} from 'net'
import { socketServer } from "../src";
import { Server } from "socket.io";
import {Server as httpServer} from 'http'

describe("Testing Socket Server", () => {
  let io:Server, clientSocket:Socket;
  let httpServer: httpServer
  beforeEach((done) => {
    httpServer = createServer();
    io = socketServer(httpServer);
    httpServer.listen(() => {
      done()
    });
  });

  afterEach(() => {
    httpServer.close()
    io.close();
    clientSocket.close();
  });

  test("passing invalid token", (done) => {
      clientSocket =  Client(`http://localhost:${(httpServer.address() as AddressInfo).port}`, {
        auth: {
          token: "INVALID_TOKEN"
        }
      });

      clientSocket.on("connect_error", (err:any) => {
        expect(err.message).toBe("invalid token")
        done()
      });
  });

    test("Testing secret and important event using valid token", (done) => {
      clientSocket =  Client(`http://localhost:${(httpServer.address() as AddressInfo).port}`, {
        auth: {
          token: "VALID_TOKEN"
        }
      });

        clientSocket.emit("send_nudes", ({secret:"SECRET_TOKEN"}))
        clientSocket.on("receive_nudes", (msg:any)=>{
          expect(msg).toBe("Sending Nudes to all connection")
          done()
        })
  });
});