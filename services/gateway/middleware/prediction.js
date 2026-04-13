import axios from "axios";

export const mlPrediction = async (req, res, next) => {

  if (req.injection) {
    req.anomalyScore = 0.01
    req.attack = true;
  }
   else {
     const response = await axios.post(
       "http://localhost:8000/predict",
       req.features
     );
   
     req.anomalyScore = response.data.anomaly_score;
     req.attack = response.data.attack;
   }


  next();
};