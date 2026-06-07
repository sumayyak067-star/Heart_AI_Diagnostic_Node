"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { User, Mail, ShieldAlert, Award, FileSpreadsheet, Lock, Check } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, addToast } = useApp();

  const [name, setName] = useState(user?.name || "Dr. Alex Carter");
  const [email, setEmail] = useState(user?.email || "alex.carter@healthai.com");
  const [medicalId, setMedicalId] = useState(user?.medicalId || "MED-80234");
  
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast("Profile Validation", "Profile requires both identifier name and active email node.", "warning");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      updateProfile({ name, email, medicalId });
      setIsLoading(false);
    }, 800);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass || !confirmNewPass) {
      addToast("Validation Failed", "Please fully fill all passcode fields.", "warning");
      return;
    }

    if (newPass !== confirmNewPass) {
      addToast("Validation Failed", "New passcodes do not match. Verify entries.", "warning");
      return;
    }

    if (newPass.length < 8) {
      addToast("Validation Failed", "New passcode is too short. Minimum 8 characters.", "warning");
      return;
    }

    addToast("Passcode Re-calibrated", "Passcode reset simulated. Clinical token re-hashed.", "success");
    setOldPass("");
    setNewPass("");
    setConfirmNewPass("");
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none animate-fadeIn">
      {/* 1. Header greeting */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Clinician Workstation Profile
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Review, authenticate, and modify clinical node identifiers and diagnostic privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Summary of clinician profile & privileges */}
        <Card
          variant="glass"
          className="p-6 border-slate-200/60 dark:border-slate-900 flex flex-col justify-between items-center text-center h-fit"
        >
          <div className="flex flex-col items-center">
            {/* User Avatar Circle */}
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white text-3xl font-black select-none border-2 border-indigo-400/25 mb-4 shadow-xl">
              {name.charAt(0).toUpperCase()}
            </div>
            
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase leading-none">
              {name}
            </h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mt-2">
              {medicalId}
            </span>
          </div>

          <div className="w-full border-t border-slate-100 dark:border-slate-900 my-6 pt-6 flex flex-col gap-4 text-left">
            <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-wider">
              Diagnostic Privileges
            </span>
            <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium">
              <Award className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-700 dark:text-slate-350">Supervised AI Access:</strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">Fully authorized to run client-side Logistic Classifications.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium">
              <FileSpreadsheet className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-700 dark:text-slate-350">Data Logs Sync:</strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">Enabled local cache logs for historical patient trend analysis.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
              Active Session
            </span>
          </div>
        </Card>

        {/* Right side: Forms to modify info and change passcode (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Card 1: Clinician Info Form */}
          <Card variant="glass" className="p-6 border-slate-200/60 dark:border-slate-900">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Clinician Profile details
            </h4>
            
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name (Clinical Identifier)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Unique Medical ID"
                  value={medicalId}
                  onChange={(e) => setMedicalId(e.target.value)}
                  leftIcon={<Award className="h-4 w-4" />}
                  required
                />
              </div>

              <Input
                label="Clinical Email Node"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-900 mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="font-bold text-xs uppercase tracking-widest cursor-pointer"
                >
                  Save Profile Modifications
                </Button>
              </div>
            </form>
          </Card>

          {/* Card 2: Passcode reset Simulation */}
          <Card variant="glass" className="p-6 border-slate-200/60 dark:border-slate-900">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Passcode Calibration Terminal
            </h4>
            
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <Input
                label="Current Workstation Passcode"
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Calibration Passcode"
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Verify New Passcode"
                  type="password"
                  value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-900 mt-2">
                <Button
                  type="submit"
                  variant="outline"
                  className="border-slate-800 text-slate-300 hover:text-white bg-slate-950/40 font-bold text-xs uppercase tracking-widest cursor-pointer"
                >
                  Calibrate Security Passcode
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
