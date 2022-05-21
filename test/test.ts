// with { "type": "module" } in your package.json
import { createServer } from "http";
import { io as Client, Socket } from "socket.io-client";
import { expect } from "chai";
import {AddressInfo} from 'net'
import { socketServer } from "../src";
import { Server } from "socket.io";
import {Server as httpServer} from 'http'

describe("my awesome project", () => {
  let io:Server, clientSocket:Socket;
  let httpServer: httpServer
  before((done) => {
    httpServer = createServer();
    io = socketServer(httpServer);
    httpServer.listen(() => {
      done()
    });
  });


  after(() => {
    httpServer.close()
    io.close();
    clientSocket.close()
  });

  it("passing invalid token", (done) => {
      clientSocket =  Client(`http://localhost:${(httpServer.address() as AddressInfo).port}`, {
        auth: {
          token: "INVALID_TOKEN"
        }
      });

      clientSocket.on("connect_error", (err) => {
        expect(err.message).to.equal("invalid token")
        done()
      }); 
  });

  it("passing valid token", (done) => {
    clientSocket =  Client(`http://localhost:${(httpServer.address() as AddressInfo).port}`, {
      auth:{
        token: "VALID_TOKEN"
      }
    });

    clientSocket.emit("send_nudes",({secret: "SECRET_TOKEN"}))
    clientSocket.on("receive_nudes", (msg:any)=>{
      expect(msg).to.equal("Sending Nudes to all connection")
      done()
    })
  });


});