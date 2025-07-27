
# A Walkthrough of socket.io usage with Node and Express

## HTTP Request v/s Socket.io
The methods like ```GET, POST, PUT, DELETE```, are often used in HTTP requests. But the server can only respond if the communication is initiated by the client. The server can not send a response if the client has not generated a request. 

Hence, in applications like a real time chat application, where the message should appear in the client side even if the page has not been refreshed or the client has not asked the server, it causes issues.

One method is to constantly poll the server to see if there are new messages, but it can create bottlenecks and use unnecessary bandwidth.

Hence we use ```socket.io```.

## Flow of index.js
- Import ```socket.io``` and ```http server``` in index.js.
- ```
    import http from "http";
    import { Server } from "socket.io";
  ```
- Create the socket server
    ```
    const server = http.createServer(app);
    const io = new Server(server, {
    cors: {
        origin: "*",
    }
    });
    ```

- Use the socket middleware 
    ```
    app.use((req, res, next) => {
        req.io = io;
        next();
    });
    ```
- Socket server initialization
    ```
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
    ```

## Flow of the controller using socket connection, in our case, being a chat room
- Update the database for all the users 
    ```
    await ChatUser.updateMany({}, { $push: { chats: message } });
    ```
- Emit the changes so that the frontend of all the users is notified of recent changes in the database :-
    ```
    req.io.emit("new_chat", message); 
    ```
- To catch the emitted changes in the frontend
    ```
    socket.on("new_chat", (message) => {
        console.log("New chat received:", message);
    });
    ```

## PS
- This is the basic structure of the backend of a global chat room. One can create a chat room between specific users, by using ```findByIdAndUpdate```, instead of ```updateMany```.
- One can also create chat rooms by using ```updateMany({#condition})``` to only update the chats that have a certain condition met.
- Socket.io is more relevant for propagating changes in the frontend, because the backend changes are mostly instant. Socket.io intimates the frontend that there are some changes made in the backend.








