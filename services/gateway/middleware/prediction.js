import axios from "axios";

export const mlPrediction = async (req, res, next) => {

  console.log(req.features);
  console.log("here");
  const response = await axios.post(
    "http://localhost:8000/predict",
    req.features
  );

  req.anomalyScore = response.data.anomaly_score;
  req.attack = response.data.attack;

  next();
};