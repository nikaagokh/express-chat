import authService from "./auth.js";
import cookieService from "./cookie.js";
class SocketService {
    constructor() {
        this.socketAuth = document.createElement('div');
        this.authService = authService;
        this.cookieService = cookieService;
    }
    
    initSocket() {
        const token = this.cookieService.getCookie();
        this.socket = io('http://localhost:3005', {
            query: {
                access_token:token
              }
        });
        this.socket.on("connect", () => {
            console.log(1);
            this.socketAuth.dispatchEvent(new CustomEvent('changed', {detail:true}));
        })
        this.socket.on("connect_error", (err) => {
            console.log(2);
            this.socketAuth.dispatchEvent(new CustomEvent('changed', {detail:false}));
        })

        this.socket.on("disconnect", (reason) => {
            console.log(3);
            this.socketAuth.dispatchEvent(new CustomEvent('changed', {detail:false}));
        })

        this.socket.on('messaged', (ev) => {
            console.log(ev);
        })
        
    }
    

    closeConnection() {
        if(this.socket) {
            this.socket.close();
        }
    }

    reconnectSocket() {
        this.socket.io.opts.query = {access_token: this.cookieService.getCookie()};
        this.socket.disconnect();
        this.socket.connect();
    }

    handleAuthStateChange() {
        this.authService.authStateChange.subscribe(logged => {
          if(logged) {
            this.reconnectSocket();
          } else {
            this.closeConnection();
          }
        })
    }

    emit() {
        
    }

    getMessage() {
        return new Promise((resolve, reject) => {
            this.socket.on('message-send', (data) => {
                resolve(data);
            });
        });
    }

    

}

const socketService = new SocketService();
export default socketService;