const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");

const { addUser,removeUser,getAllUsers,getUser,changeUsername} = require("./helper_functions")

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json())

server = http.createServer(app);

const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")

const chatControllers = require("./controllers/chatControllers")

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)

const io = socketio(server,{
    cors:{
        origin:"*",
        methods:['GET','POST']
    }
});

io.on('connection',(socket)=>{

    socket.on('join',(data) =>{

        const user = addUser(socket.id,data.username,data.channel_id,data.channel_name)
        socket.join(user.channel_id);
        socket.broadcast.to(user.channel_id).emit('joined',{username : user.username});;
        
    })

    socket.on('sendMessage',(data)=>{
        const user = getUser(socket.id);
        chatControllers.addMessage(data.channel_id,data.message_data);
        var message = {user_id: user.id, username:user.username, message : data.message_data.message, timestamp: data.message_data.timestamp}
        io.to(user.channel_id).emit('message',message);
    })

    socket.on("banned_kekw",()=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("banned_kekw",{username : user.username});
    });

    socket.on("joined",()=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("joined",{username : user.username});
    });

    socket.on("disconnected",()=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("disconnected",{username : user.username});
    });

    socket.on("octogone",(enemy)=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("octogone",{username_1 : user.username,username_2 : enemy});
    });

    socket.on("gigachad",()=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("gigachad",{username : user.username});
    });
    socket.on("jotaro",()=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("jotaro",{username : user.username});
    });
    socket.on("coming",(enemy)=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("coming",{username_1 : user.username,username_2 : enemy});
    });
    socket.on("gyoza",()=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("gyoza",{username : user.username});
    });
    socket.on("kouisine",()=>{
        const user = getUser(socket.id);
        io.to(user.channel_id).emit("kouisine",{username : user.username});
    });

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);

        if(user){
            io.to(user.channel_id).emit('disconnected',{username : user.username});
        }
    })
    socket.on('changeNickname',(data)=>{
        const user = getUser(socket.id);
        const username = user.username
        changeUsername(socket.id,data)
        const new_user = getUser(socket.id);
        const new_username = new_user.username
        io.to(user.channel_id).emit("face_swap",{username : username, new_username : new_username});
    })
})

app.use(express.json());

server.listen(PORT, ()=> console.log(("Server started at PORT " + PORT)))