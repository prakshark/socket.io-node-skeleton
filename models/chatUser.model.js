import mongoose from "mongoose";

const chatUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    chats: {
        type: [String]
    }
});

const ChatUser = mongoose.model("ChatUser", chatUserSchema);
export default ChatUser;