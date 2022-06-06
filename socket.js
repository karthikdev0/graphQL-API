let io;


module.exports = {
    init: httpserver  => {
        io=  require('socket.io')(httpserver,{
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
               }
        });

        return io;
    },
    getIO:() =>{
        if(!io){
            return new Error('Socket.io is not initialized');
        }
        return io;
    }

};