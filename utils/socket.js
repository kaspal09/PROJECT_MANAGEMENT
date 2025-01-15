let socketData
const socketConnection = (io, socket) => {
    socketData = socket;

    socketData.on("join", (msg) => {
        console.log(msg)
        socket.emit("welcome", "Welcome to the chat")
    })

    // Listen for notifications when a project is created
    socketData.on("notifyProjectCreated", (data) => {
        console.log(data.message); // Log: "A new project was created: Project Name"
        io.emit("notifyProjectCreated", data); // Broadcast the notification to all clients
    });

    // Listen for notifications when a project is updated
    socket.on("notifyProjectUpdated", (data) => {
        console.log(data.message); // Log: "The project 'Project Name' was updated."
        io.emit("notifyProjectUpdated", data); // Broadcast the notification to all clients
    });

    // Listen for notifications when a project is deleted
    socket.on("notifyProjectDeleted", (data) => {
        console.log(data.message); // Log: "A project was deleted: Project ID"
        io.emit("notifyProjectDeleted", data); // Broadcast the notification to all clients
    });

    // Listen for notifications when a task is added
    socket.on("notifyTaskAdded", (data) => {
        console.log(data.message); // Log: "A new task 'Task Name' was added to project 'Project ID'."
        io.emit("notifyTaskAdded", data); // Broadcast the notification to all clients
    });

    // Listen for notifications when a task is removed
    socket.on("notifyTaskRemoved", (data) => {
        console.log(data.message); // Log: "The task 'Task Name' was removed from project 'Project ID'."
        io.emit("notifyTaskRemoved", data); // Broadcast the notification to all clients
    });

    // Listen for notifications when a task is updated
    socket.on("notifyTaskUpdated", (data) => {
        console.log(data.message); // Log: "The task 'Task Name' was updated in project 'Project ID'."
        io.emit("notifyTaskUpdated", data); // Broadcast the notification to all clients
    });
};

//functions
const sendMessage = (eventName, data) => {
    if (!socketData) {
        console.log("Socket Not Initailized ")
        return
    }
    socketData.emit(eventName, data.message)

}
const recieveMessage = (data) => {
    if (!socketData) {
        console.log("socket is initailized ")
        return
    }
    socketData.emit("recieveMsg", data)
}

module.exports = { socketConnection, sendMessage, recieveMessage }