"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button 
      onClick={() => typeof window !== 'undefined' && window.print()} 
      className="bg-blue-600 hover:bg-blue-700"
    >
      <Printer className="w-4 h-4 mr-2" />
      Print Now
    </Button>
  );
}
