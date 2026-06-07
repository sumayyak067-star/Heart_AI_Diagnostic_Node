export interface HeartDiseaseInput {
  age: number;      // Age in years
  sex: number;      // 1 = Male, 0 = Female
  cp: number;       // Chest pain type (0 = Typical Angina, 1 = Atypical Angina, 2 = Non-Anginal Pain, 3 = Asymptomatic)
  trestbps: number; // Resting blood pressure (mm Hg)
  chol: number;     // Serum cholesterol (mg/dl)
  fbs: number;      // Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
  restecg: number;  // Resting electrocardiographic results (0 = Normal, 1 = ST-T Wave Abnormality, 2 = Left Ventricular Hypertrophy)
  thalach: number;  // Maximum heart rate achieved
  exang: number;    // Exercise induced angina (1 = yes, 0 = no)
  oldpeak: number;  // ST depression induced by exercise relative to rest
  slope: number;    // The slope of the peak exercise ST segment (0 = Upsloping, 1 = Flat, 2 = Downsloping)
  ca: number;       // Number of major vessels (0-4) colored by flourosopy
  thal: number;     // Thalassemia (0 = Null, 1 = Normal, 2 = Fixed Defect, 3 = Reversible Defect)
}

export interface HeartDiseaseResult {
  probability: number; // Probability of heart disease presence (0.0 to 1.0)
  isHighRisk: boolean; // True if probability >= 0.50
  confidence: number;  // Confidence rating (0 to 100%)
  insights: {
    category: "warning" | "optimal" | "info";
    text: string;
  }[];
}

// Coefficients trained directly on the Cleveland dataset (heart.csv)
const INTERCEPT = 4.519865;

const COEFFICIENTS: Record<keyof HeartDiseaseInput, number> = {
  age: -0.011770,
  sex: -1.609111,
  cp: 0.844614,
  trestbps: -0.020341,
  chol: -0.005207,
  fbs: -0.048852,
  restecg: 0.298721,
  thalach: 0.018637,
  exang: -1.032822,
  oldpeak: -0.529139,
  slope: 0.564409,
  ca: -0.726181,
  thal: -0.820183,
};

/**
 * Predicts heart disease probability using the Logistic Regression model parameters
 */
export function predictHeartDisease(input: HeartDiseaseInput): HeartDiseaseResult {
  // Compute log-odds z
  let z = INTERCEPT;
  
  z += input.age * COEFFICIENTS.age;
  z += input.sex * COEFFICIENTS.sex;
  z += input.cp * COEFFICIENTS.cp;
  z += input.trestbps * COEFFICIENTS.trestbps;
  z += input.chol * COEFFICIENTS.chol;
  z += input.fbs * COEFFICIENTS.fbs;
  z += input.restecg * COEFFICIENTS.restecg;
  z += input.thalach * COEFFICIENTS.thalach;
  z += input.exang * COEFFICIENTS.exang;
  z += input.oldpeak * COEFFICIENTS.oldpeak;
  z += input.slope * COEFFICIENTS.slope;
  z += input.ca * COEFFICIENTS.ca;
  z += input.thal * COEFFICIENTS.thal;

  // Apply logistic sigmoid function: P(y=1|x) = 1 / (1 + exp(-z))
  const probability = 1 / (1 + Math.exp(-z));
  
  // High risk threshold is 0.5
  const isHighRisk = probability >= 0.5;

  // Calculate confidence score (distance from decision boundary 0.5 mapped to 0-100)
  const confidence = Math.round(Math.abs(probability - 0.5) * 2 * 100);

  // Generate automated clinical biometrics insights
  const insights: { category: "warning" | "optimal" | "info"; text: string }[] = [];

  // Blood pressure insights
  if (input.trestbps >= 140) {
    insights.push({
      category: "warning",
      text: `Stage 1/2 Hypertension detected: Resting blood pressure of ${input.trestbps} mm Hg exceeds safe levels (optimal: < 120).`
    });
  } else if (input.trestbps >= 130) {
    insights.push({
      category: "info",
      text: `Pre-hypertension levels noted: Resting blood pressure of ${input.trestbps} mm Hg is slightly elevated.`
    });
  } else {
    insights.push({
      category: "optimal",
      text: `Healthy resting blood pressure profile: Blood pressure is stable at ${input.trestbps} mm Hg.`
    });
  }

  // Cholesterol insights
  if (input.chol >= 240) {
    insights.push({
      category: "warning",
      text: `Hypercholesterolemia risk: Total cholesterol is high at ${input.chol} mg/dl. Elevated levels block arteries (optimal: < 200).`
    });
  } else if (input.chol >= 200) {
    insights.push({
      category: "info",
      text: `Borderline high cholesterol level of ${input.chol} mg/dl. Dietary adjustments recommended.`
    });
  } else {
    insights.push({
      category: "optimal",
      text: `Optimal cholesterol levels: Total serum cholesterol is excellent at ${input.chol} mg/dl.`
    });
  }

  // Fasting Blood Sugar
  if (input.fbs === 1) {
    insights.push({
      category: "warning",
      text: "Elevated Fasting Blood Sugar (> 120 mg/dl) flags pre-diabetes or diabetic conditions, raising cardiovascular risks."
    });
  }

  // Maximum Heart Rate (Age-predicted max: 220 - age)
  const predMaxHr = 220 - input.age;
  const hrPercentage = Math.round((input.thalach / predMaxHr) * 100);
  if (input.thalach > predMaxHr) {
    insights.push({
      category: "warning",
      text: `Maximum heart rate achieved during exercise (${input.thalach} bpm) is exceptionally high and exceeds age-predicted limits (${predMaxHr} bpm).`
    });
  } else if (input.thalach < 110) {
    insights.push({
      category: "info",
      text: `Low cardiovascular responsiveness: Maximum achieved heart rate of ${input.thalach} bpm represents only ${hrPercentage}% of age-predicted maximum capacity.`
    });
  } else {
    insights.push({
      category: "optimal",
      text: `Robust heart rate reserve: Max achieved heart rate is ${input.thalach} bpm (${hrPercentage}% of age capacity).`
    });
  }

  // Chest Pain
  if (input.cp === 0) {
    insights.push({
      category: "optimal",
      text: "No active typical angina symptoms reported. Asymptomatic resting status."
    });
  } else if (input.cp === 3) {
    insights.push({
      category: "warning",
      text: "Asymptomatic chest pains (Type 3) are reported, which clinically require diagnostic testing to rule out silent ischemia."
    });
  } else {
    const painTypes = ["Typical Angina", "Atypical Angina", "Non-Anginal Pain"];
    insights.push({
      category: "warning",
      text: `Angina discomfort flagged: Patient reports chest pain classified as "${painTypes[input.cp]}", correlating strongly with ischemic risks.`
    });
  }

  // Exercise Angina
  if (input.exang === 1) {
    insights.push({
      category: "warning",
      text: "Exercise-Induced Angina (EXANG) is positive, showing significant coronary artery perfusion shortages under physical stress."
    });
  }

  // ST Depression
  if (input.oldpeak > 1.5) {
    insights.push({
      category: "warning",
      text: `Substantial ST segment depression of ${input.oldpeak} mm indicates ischemia, warning of possible CAD (Coronary Artery Disease).`
    });
  }

  // Number of Major Vessels
  if (input.ca > 0) {
    insights.push({
      category: "warning",
      text: `${input.ca} major heart blood vessels show fluoroscopy obstruction, which is a key clinical predictor of arterial stenosis.`
    });
  } else {
    insights.push({
      category: "optimal",
      text: "Optimal fluoroscopy clearance: Zero major blood vessels show signs of calcified narrowing or blockage."
    });
  }

  // Thalassemia
  if (input.thal === 3) {
    insights.push({
      category: "warning",
      text: "Thalassemia diagnostic results show a reversible defect, indicating transient perfusion shortages during cardiodynamic stress."
    });
  }

  return {
    probability,
    isHighRisk,
    confidence,
    insights
  };
}
