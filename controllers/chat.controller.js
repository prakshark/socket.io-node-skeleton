import ChatUser from "../models/chatUser.model.js";

export async function getAllChats(req, res) {
    const id = req.user.id;
    const user = await ChatUser.findOne({_id: id});
    const allChats = user.chats;
    res.status(200).json({
        status: 200,
        chats: allChats
    });
}

export async function addChat(req, res) {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        await ChatUser.updateMany({}, { $push: { chats: message } });

        req.io.emit("new_chat", message); 

        // TO LISTEN FOR new_chat EVENT, USE THIS SNIPPET IN FRONTEND :-
        // socket.on("new_chat", (message) => {
        //     console.log("New chat received:", message);
        // });

        return res.json({
            message: "Chat added to all users"
        });
    } catch (error) {
        console.error("Failed to add chat:", error);
        return res.status(500).json({ error: "Internal Server Error while adding chat" });
    }
}