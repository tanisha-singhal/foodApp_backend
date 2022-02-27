// npm init
//npm i express
// Express.js is a framework of Node.js which means that most of the code is already written for programmers to work with.

const express = require("express");
const cookieParser=require("cookie-parser");
const userRouter=require("./Routers/userRouter");
const authRouter=require("./Routers/authRouter");
const planRouter=require("./Routers/planRouter");
const reviewRouter=require("./Routers/reviewRouter");
const bookingRouter=require("./Routers/bookingRouter")
// Server: route->request->response/file
// File System: path->interact/type->file/folder
// server init
const app = express();
// post accept
app.use(express.json());
app.use(cookieParser());
// to serve static files in express
app.use(express.static('public'));

// let user = [{}];
// function createUser(req, res) {
//   console.log("req.data", req.body);
//   user = req.body;
//   res.status(200).json("data received and user added.");
// }




// mounting in express


app.use("/api/user", userRouter);
app.use("/api/auth",authRouter);
app.use("/api/plan",planRouter);
app.use("/api/review",reviewRouter);
app.use("/api/booking",bookingRouter);
//create
// giving data to server
// app.post("/user",createUser)
// // get/read
// app.get("/user",getUser)
// //update
// app.patch("/user",updateUser)
// //delete
// app.delete("/user",deleteUser)
// //template route
// app.get("/user/:id",getUserById)

app.listen(process.env.PORT || 8080, function (req, res) {
  console.log("server listening at localhost:8080");
});
