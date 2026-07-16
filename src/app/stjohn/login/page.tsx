"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function StJohnLogin() {
  const [id, setId] = useState("STJOHN-9780");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === "STJOHN-9780" && password === "stjohn123") {
      // Set a simple cookie or localStorage to protect the form route
      document.cookie = "stjohn_auth=true; path=/stjohn; max-age=86400";
      router.push("/stjohn/form");
    } else {
      setError("Invalid ID or Password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200/60 rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">School Portal</CardTitle>
          <CardDescription className="text-blue-100 font-medium mt-2">
            St. John Samaritan English Medium School
          </CardDescription>
        </div>
        
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center border border-red-100 animate-in fade-in zoom-in">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">School ID</Label>
              <div className="relative">
                <Input 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 font-medium" 
                  placeholder="Enter School ID"
                  required
                />
                <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Password</Label>
              <div className="relative group">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 pr-12 rounded-xl bg-slate-50 border-slate-200 font-medium focus-visible:ring-blue-500" 
                  placeholder="Enter Password"
                  required
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
