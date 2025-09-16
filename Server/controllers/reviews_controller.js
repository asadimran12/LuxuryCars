const Reviews = require("../model/review_model");
const Car = require("../model/car_model");

const addReviewToCar = async (req, res) => {
  try {
    const { review, rating, reviewshowroom } = req.body;
    const carId = req.params.id;
    const newReview = new Reviews({
      reviewerid: req.user._id,
      review,
      rating,
      reviewshowroom,
      reviewcar: carId,
    });

    await newReview.save();
    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addReviewToDriver = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const driverid = req.params.id;
    const newReview = new Reviews({
      reviewerid: req.user._id,
      review,
      rating,
      reviewtodriver: driverid,
    });

    await newReview.save();
    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const showroomgetallreviews = async (req, res) => {
  try {
    const showroomId = req.showroom.id;

    const cars = await Car.find({ listedBy: showroomId }).select("_id");

    if (!cars || cars.length === 0) {
      return res
        .status(404)
        .json({ message: "No cars found for this showroom" });
    }

    const carIds = cars.map((car) => car._id);
    const reviews = await Reviews.find({ reviewcar: { $in: carIds } })
      .populate("reviewerid", "username email")
      .populate("reviewcar", "name brand model");

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const showroomgetspecificreview = async (req, res) => {
  try {
    const showroomId = req.showroom.id;
    const reviewId = req.params.id;

    const review = await Reviews.findById(reviewId)
      .populate("reviewerid", "username email")
      .populate("reviewcar", "name brand model listedBy");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewcar && review.reviewcar.listedBy == showroomId) {
      return res
        .status(403)
        .json({ message: "This review does not belong to your showroom" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const drivergetallreviews = async (req, res) => {
  const driverid = req.driver.id;

  try {
    const review = await Reviews.find({ reviewtodriver: driverid });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const drivergetspecificreviews = async (req, res) => {
  const driverid = req.driver.id;
  const reviewid = req.params.id;

  try {
    const review = await Reviews.findOne({
      _id: reviewid,
      reviewtodriver: driverid,
    })
      .populate("reviewerid", "name email")
      .populate("reviewtodriver", "name");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching specific review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addReviewToCar,
  addReviewToDriver,
  showroomgetallreviews,
  showroomgetspecificreview,
  drivergetallreviews,
  drivergetspecificreviews,
};
