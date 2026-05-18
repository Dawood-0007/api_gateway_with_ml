import axios from "axios";

export const mlPrediction = async (req, res, next) => {
  const baseUrl = process.env.ML_SERVICE;

  if (req.injection || req.blocked) {
    req.anomalyScore = 0.01
    req.attack = true;
  }
   else {
     const response = await axios.post(
       `${baseUrl}/predict`,
       req.features
     );
   
     req.anomalyScore = response.data.anomaly_score;
     req.attack = response.data.attack;
   }


  next();
};