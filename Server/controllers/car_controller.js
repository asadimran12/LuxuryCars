const Car = require("../model/car_model");
const Booking = require("../model/booking_model");
const User_model = require("../model/auth_model");
const nodemailer = require("nodemailer");

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    if (!cars) {
      return res.status(404).json("No Cars Availabel");
    }
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json("No Cars Availabel");
    }
    return res.status(200).json(car);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const searchCar = async (req, res) => {
  try {
    const { searchcar, price } = req.query;
    if (!searchcar || !price) {
      return res.status(404).json({ message: "Missing searchcar or price" });
    }
    const querry = {
      name: { $regex: new RegExp(searchcar, "i") },
      pricePerDay: { $lte: Number(price) },
    };
    const cars = await Car.find(querry);
    return res.status(200).json({ cars });
  } catch (error) {
    return res.status(401).json({ error });
  }
};

const bookingCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const { startDate, endDate } = req.body;
    const userId = req.user._id;

    if (!startDate || !endDate || !userId) {
      return res.status(404).json({ error: "Missing booking information." });
    }

    const car = await Car.findById(carId);
    if (!car || !car.availability) {
      return res.status(404).json({ error: "Car not available for booking." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      return res.status(404).json({ error: "Invalid date range." });
    }
    const totalPrice = days * car.pricePerDay;

    const booking = new Booking({
      user: userId,
      car: carId,
      startDate,
      endDate,
      totalPrice,
      status: "Pending",
    });

    await booking.save();

    car.availability = false;
    await car.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Luxury Cars" <${process.env.EMAIL_USER}>`,
      to: req.user.email,
      subject: "Luxury Cars - Booking Confirmation",
      html: `
        <div style="font-family:Arial, sans-serif; padding:20px; background:#f8f9fa;">
          <h2 style="color:#333;">Booking Confirmed ✅</h2>
          <p>Hello <b>${req.user.username}</b>,</p>
          <p>
            Your booking for <b>${car.name}</b> has been successfully placed.
          </p>
          <p>
            <b>Start Date:</b> ${start.toDateString()} <br/>
            <b>End Date:</b> ${end.toDateString()} <br/>
            <b>Total Days:</b> ${days} <br/>
            <b>Total Price:</b> $${totalPrice}
          </p>
          <p>Status: <b>${booking.status}</b></p>
          <hr/>
          <p style="font-size:12px; color:#666;">
            © ${new Date().getFullYear()} Luxury Cars. All Rights Reserved.
          </p>
        </div>
      `,
    });

    return res
      .status(200)
      .json({ message: "Car booked successfully", booking });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
  }
};

const Getallbookings = async (req, res) => {
  try {
    const cars = await Booking.find();
    if (!cars) {
      return res.status(404).json("No Cars Availabel");
    }
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const GetSpecificbooking = async (req, res) => {
  try {
    const specifcbooking = await Booking.findById(req.params.id);
    if (!specifcbooking) {
      return res.status(404).json("No Bookings Availabel");
    }
    return res.status(200).json(specifcbooking);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const ApprovedBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
      },
      {
        new: true,
      }
    );
    if (!booking) {
      return res.status(404).json("No Bookings Found");
    }

    const user = await User_model.findById(booking.user);

    const car = await Car.findById(booking.car);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Luxury Cars" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "🚗 Luxury Cars - Booking Approved 🎉",
        html: `
          <div style="font-family:Arial, sans-serif; padding:20px; background:#f8f9fa;">
            <h2 style="color:#28a745;">Your Booking is Approved ✅</h2>
            <p>Hello <b>${user.username}</b>,</p>
            <p>
              We’re excited to let you know that your booking for 
              <b>${car.name}</b> has been <b>approved</b>.
            </p>
            <p>
              <b>Start Date:</b> ${new Date(
                booking.startDate
              ).toDateString()} <br/>
              <b>End Date:</b> ${new Date(booking.endDate).toDateString()} <br/>
              <b>Total Price:</b> $${booking.totalPrice} <br/>
              <b>Status:</b> ${booking.status}
            </p>
            <p>We’ll make sure your car is ready for you on the selected dates 🚘</p>
            <hr/>
            <p style="font-size:12px; color:#666;">
              © ${new Date().getFullYear()} Luxury Cars. All Rights Reserved.
            </p>
          </div>
        `,
      });
      console.log("✅ Email sent successfully to", user.email);
    } catch (mailErr) {
      console.error("❌ Email sending failed:", mailErr);
    }
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const DeleteBooking = async (req, res) => {
  try {
    const deletebooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletebooking) {
      return res.status(404).json("No Cars Availabel");
    }
    return res.status(200).json("Booking Deleted Successfully");
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const Addnewcar = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      year,
      fuelType,
      seats,
      pricePerDay,
      availability,
      description,
      features,
    } = req.body;
    const listedBy = req.showroom._id;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const existingCar = await Car.findOne({ brand, model, year });
    if (existingCar) {
      return res.status(400).json({ error: "Car already exists in database" });
    }

    const car = new Car({
      name,
      brand,
      model,
      year,
      fuelType,
      seats,
      pricePerDay,
      availability,
      description,
      features,
      image, // optional, can stay empty
      listedBy,
    });

    await car.save();

    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const DeleteCar = async (req, res) => {
  try {
    const deleteCar = await Car.findByIdAndDelete(req.params.id);
    if (!deleteCar) {
      return res.status(404).json("No Cars Availabel");
    }
    return res.status(200).json("Car Deleted Successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllCars,
  getCarById,
  searchCar,
  bookingCar,
  Getallbookings,
  GetSpecificbooking,
  ApprovedBooking,
  DeleteBooking,
  Addnewcar,
  DeleteCar,
};
