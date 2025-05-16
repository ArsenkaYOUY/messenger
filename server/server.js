import http from 'http'
import { Server } from 'socket.io'
import { configureSockets } from './controllers/socketController.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin: '*',
        credentials: true,
    }
})

configureSockets(io)

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
