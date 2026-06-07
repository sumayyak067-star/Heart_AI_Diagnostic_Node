"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { HeartDiseaseInput, HeartDiseaseResult, predictHeartDisease } from "@/lib/lrModel";

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  medicalId?: string;
}

export interface SavedPrediction {
  id: string;
  timestamp: string;
  input: HeartDiseaseInput;
  result: HeartDiseaseResult;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AppContextType {
  user: UserProfile | null;
  theme: "light" | "dark";
  predictions: SavedPrediction[];
  toasts: ToastMessage[];
  login: (email: string, name: string) => Promise<boolean>;
  signup: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  addPrediction: (input: HeartDiseaseInput) => HeartDiseaseResult;
  deletePrediction: (id: string) => void;
  clearHistory: () => void;
  addToast: (title: string, message: string, type: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial historical data from actual heart.csv rows to make the dashboard look stunning immediately!
const INITIAL_PREDICTIONS_INPUTS: HeartDiseaseInput[] = [
  { age: 52, sex: 1, cp: 0, trestbps: 125, chol: 212, fbs: 0, restecg: 1, thalach: 168, exang: 0, oldpeak: 1.0, slope: 2, ca: 2, thal: 3 }, // Low risk actual
  { age: 58, sex: 0, cp: 0, trestbps: 100, chol: 248, fbs: 0, restecg: 0, thalach: 122, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2 }, // High risk actual
  { age: 70, sex: 1, cp: 0, trestbps: 145, chol: 174, fbs: 0, restecg: 1, thalach: 125, exang: 1, oldpeak: 2.6, slope: 0, ca: 0, thal: 3 }, // Low risk actual
  { age: 34, sex: 0, cp: 1, trestbps: 118, chol: 210, fbs: 0, restecg: 1, thalach: 192, exang: 0, oldpeak: 0.7, slope: 2, ca: 0, thal: 2 }, // High risk actual
  { age: 61, sex: 1, cp: 0, trestbps: 148, chol: 203, fbs: 0, restecg: 1, thalach: 161, exang: 0, oldpeak: 0.0, slope: 2, ca: 1, thal: 3 }  // Low risk actual
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [predictions, setPredictions] = useState<SavedPrediction[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("heart_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Default mock user for easy direct view of the dashboard
      const defaultUser: UserProfile = {
        name: "Dr. Alex Carter",
        email: "alex.carter@healthai.com",
        avatarUrl: "/avatars/doctor-avatar.webp",
        bio: "Senior Cardiologist & AI-Healthcare Researcher",
        medicalId: "MED-90234"
      };
      setUser(defaultUser);
      localStorage.setItem("heart_user", JSON.stringify(defaultUser));
    }

    const savedTheme = localStorage.getItem("heart_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    const savedHistory = localStorage.getItem("heart_predictions");
    if (savedHistory) {
      setPredictions(JSON.parse(savedHistory));
    } else {
      // Initialize with realistic seed data
      const seedHistory: SavedPrediction[] = INITIAL_PREDICTIONS_INPUTS.map((input, idx) => {
        const result = predictHeartDisease(input);
        const date = new Date();
        date.setDate(date.getDate() - (idx + 1) * 3); // Spaced days in the past
        return {
          id: `seed-pred-${idx}`,
          timestamp: date.toLocaleString(),
          input,
          result
        };
      });
      setPredictions(seedHistory);
      localStorage.setItem("heart_predictions", JSON.stringify(seedHistory));
    }
  }, []);

  // Sync theme to DOM
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("heart_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    addToast("Theme Switched", `Successfully updated UI mode to ${nextTheme}.`, "info");
  };

  // Simulated authentication methods
  const login = async (email: string, name: string): Promise<boolean> => {
    // Basic mock delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser: UserProfile = {
      name,
      email,
      avatarUrl: "/avatars/doctor-avatar.webp",
      bio: "Medical Diagnostics Consultant",
      medicalId: `MED-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setUser(mockUser);
    localStorage.setItem("heart_user", JSON.stringify(mockUser));
    addToast("Login Successful", `Welcome back, ${name}!`, "success");
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser: UserProfile = {
      name,
      email,
      avatarUrl: "/avatars/doctor-avatar.webp",
      bio: "Clinical AI Practitioner",
      medicalId: `MED-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setUser(mockUser);
    localStorage.setItem("heart_user", JSON.stringify(mockUser));
    addToast("Account Created", "Successfully registered health professional credentials.", "success");
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("heart_user");
    addToast("Logged Out", "Clinical session closed safely.", "info");
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const nextProfile = { ...user, ...profile };
    setUser(nextProfile);
    localStorage.setItem("heart_user", JSON.stringify(nextProfile));
    addToast("Profile Updated", "Diagnostics profile changes stored.", "success");
  };

  // Prediction calculations & storage
  const addPrediction = (input: HeartDiseaseInput): HeartDiseaseResult => {
    const result = predictHeartDisease(input);
    const newRecord: SavedPrediction = {
      id: `pred-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      input,
      result
    };
    const nextPredictions = [newRecord, ...predictions];
    setPredictions(nextPredictions);
    localStorage.setItem("heart_predictions", JSON.stringify(nextPredictions));
    
    if (result.isHighRisk) {
      addToast(
        "Critical Prediction Alert",
        `High cardiovascular risk detected (${Math.round(result.probability * 100)}% risk). Please check recommendations immediately.`,
        "warning"
      );
    } else {
      addToast(
        "Prediction Completed",
        `Low cardiovascular risk detected (${Math.round(result.probability * 100)}% risk). Patient biometrics optimal.`,
        "success"
      );
    }
    return result;
  };

  const deletePrediction = (id: string) => {
    const nextPredictions = predictions.filter((p) => p.id !== id);
    setPredictions(nextPredictions);
    localStorage.setItem("heart_predictions", JSON.stringify(nextPredictions));
    addToast("Record Deleted", "Biometric prediction record permanently removed.", "info");
  };

  const clearHistory = () => {
    setPredictions([]);
    localStorage.setItem("heart_predictions", JSON.stringify([]));
    addToast("History Cleared", "Cardiological prediction log completely cleared.", "info");
  };

  // Toast Alerts Management
  const addToast = (title: string, message: string, type: ToastMessage["type"]) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        theme,
        predictions,
        toasts,
        login,
        signup,
        logout,
        updateProfile,
        toggleTheme,
        addPrediction,
        deletePrediction,
        clearHistory,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
