const mongoose = require("mongoose");
const Chat = require("./models/chats.js");

main()
.then(res => console.log("connection successfull"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakeWhatsapp');
};

let allChats = ([
    {
        from : "Neha",
        to : "Preeti",
        msg : "Send me notes for the exam",
        created_at : new Date(),
    },
    {
        from : "Rohit",
        to : "Mohit",
        msg : "Teach me callbacks",
        created_at : new Date(),
    },
    {
        from : "Amit",
        to : "Sumit",
        msg : "All the best!",
        created_at : new Date(),
    },
    {
        from : "Anita",
        to : "Ramesh",
        msg : "Love you 3000",
        created_at : new Date(),
    },
    {
        from : "Tony",
        to : "Peter",
        msg : "Bring me some fruits",
        created_at : new Date(),
    },
]);

Chat.insertMany(allChats);