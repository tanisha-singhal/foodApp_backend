const express = require("express");
const Razorpay = require("razorpay");
const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");
const bookingRouter = express.Router();
const protectRoute = require("./authHelper");
const factory = require("../helpers/factory");
const {KEY_ID}=process.env;
const {KEY_SECRET}=process.env;
var razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

const initiateBooking = async function (req, res) {
  try {
    let booking = await bookingModel.create(req.body);

    let userId = booking.plan;
    let user = await userModel.findById(userId);
    user.bookings.push(booking["_id"]);
    await user.save();
    const payment_capture = 1;
    const amount = 500;
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      booking:booking,
      message:"booking created"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
async function verifyPayement(req,res){
  const secret = KEY_SECRET;

  console.log(req.body);

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    res.status(200).json({
      message: "OK",
    });
  } else {
    res.status(403).json({ message: "Invalid" });
  }
}
  


const getBookings = factory.getElements(bookingModel);
const updateBooking = factory.updateElements(bookingModel);
const deleteBooking = async function (req, res) {
  try {
    let id = req.params.id;
    let booking = await bookingModel.findByIdAndDelete(id);
    let userId = booking.user;
    let user = await userModel.findById(userId);
    let idxOfBooking = user.bookings.indexOf(booking["_id"]);
    user.bookings.splice(idxOfBooking, 1);
    await user.save();
    res.status(200).json({
      message: "Booking deleted successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getBookingById = factory.getElementById(bookingModel);

bookingRouter.use(protectRoute);
bookingRouter.route("/verification").post(verifyPayement)
bookingRouter
  .route("/:id")
  .get(getBookingById)
  .patch(updateBooking)
  .delete(deleteBooking);

bookingRouter.route("/").get(getBookings).post(initiateBooking);

module.exports = bookingRouter;
