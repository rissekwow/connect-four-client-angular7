import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { RegisterCommand } from 'src/app/shared/websocket/register-command';
import { map } from 'rxjs/operators';
import { ResponseStatusCommand } from 'src/app/shared/websocket/response-status-command';

const WEBSOCKET_SERVER_LISTNER_REGISTER = "/jsa/register";
const WEBSOCKET_CLIENT_SUBSCRIBE_TOKEN = "/game/user/";
const RESPONSE_CODE_TOKEN_REGISTERED = "TOKEN_REGISTERED";

@Injectable()
export class WebsocketService {

    private stompClient;
    private stompClient2;
    private registeredUserToken: string;

    constructor() {
     }

     initializeWebSocketConnection(serverUrl: string, username: string){
        let ws = new SockJS(serverUrl);
        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.connect({}, function(frame) {
          that.stompClient.subscribe(WEBSOCKET_CLIENT_SUBSCRIBE_TOKEN+username, (message) => {
            let responseStatusCommand: ResponseStatusCommand = JSON.parse(message.body);
            if (responseStatusCommand.responseCode === RESPONSE_CODE_TOKEN_REGISTERED) {
                this.registeredUserToken = responseStatusCommand.message;
            }
          });


        });
      }
    
      sendMessage(registerCommand: RegisterCommand){
        this.stompClient.send(WEBSOCKET_SERVER_LISTNER_REGISTER , {}, JSON.stringify(registerCommand));

      }


    
}