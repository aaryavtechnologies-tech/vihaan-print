import React from "react";
import { format } from "date-fns";

export interface StudentCardData {
  photoUrl?: string;
  studentName?: string;
  fatherName?: string;
  className?: string;
  dob?: Date | string;
  mobile?: string;
  address?: string;
  principalSignUrl?: string;
}

interface StJohnTemplatePreviewProps {
  data: StudentCardData;
}

export function StJohnTemplatePreview({ data }: StJohnTemplatePreviewProps) {
  const formattedDob = data.dob 
    ? typeof data.dob === 'string' 
      ? data.dob 
      : format(new Date(data.dob), "dd/MM/yyyy")
    : "";

  return (
    <div className="w-[1016px] h-[638px] bg-white relative overflow-hidden shadow-2xl rounded-sm transform origin-top-left" style={{ zoom: 0.5 }}>
      {/* Top Blue Banner */}
      <div className="absolute top-0 left-0 w-full h-[260px] bg-[#1A56DB] flex items-center justify-center text-center">
        {/* Logo area */}
        <div className="absolute top-[40px] left-[50px] w-[160px] h-[160px] bg-white/20 rounded-full flex items-center justify-center border-4 border-white/50">
          <span className="text-white/50 font-bold text-sm text-center px-4">SCHOOL<br/>LOGO</span>
        </div>

        {/* Header Texts */}
        <div className="absolute top-[20px] left-[40px] w-[180px] text-center text-white font-bold text-xl">
          ESTD:2001
        </div>
        
        <div className="absolute top-[20px] left-[250px] w-[700px] text-white font-bold text-xl text-center">
          HIS GRACE
        </div>
        
        <div className="absolute top-[45px] left-[250px] w-[700px] text-white italic text-2xl text-center">
          "Fear of the Lord is the beginning of wisdom"
        </div>
        
        <div className="absolute top-[75px] left-[250px] w-[700px] text-white font-extrabold text-[56px] text-center uppercase tracking-tight">
          ST.JOHN SAMARITAN
        </div>
        
        <div className="absolute top-[135px] left-[250px] w-[700px] text-white font-bold text-3xl text-center uppercase">
          ENGLISH MEDIUM PRIMARY & HIGH SCHOOL
        </div>
        
        <div className="absolute top-[175px] left-[260px] w-[680px] h-[3px] bg-white"></div>
        
        <div className="absolute top-[185px] left-[250px] w-[700px] text-white text-[22px] text-center uppercase">
          BAPUJI COLONY ANAND NAGAR OLD HUBLI-HUBBALLI
        </div>
        
        <div className="absolute top-[215px] left-[250px] w-[700px] text-white font-bold text-[22px] text-center uppercase">
          OFFICE CONTACT NO : 9902396096 - 9663868677
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-[275px] left-[300px] w-[450px] text-[#D91C1C] font-extrabold text-[42px] text-center uppercase">
        ID CARD 2026-27
      </div>

      {/* Student Data Fields */}
      <div className="absolute top-[340px] left-[320px] flex items-center">
        <span className="font-bold text-[28px] text-black w-[150px]">NAME :</span>
        <span className="text-[28px] text-black ml-4 font-semibold uppercase">{data.studentName || ""}</span>
      </div>

      <div className="absolute top-[390px] left-[320px] flex items-center">
        <span className="font-bold text-[28px] text-black w-[250px]">FATHER NAME :</span>
        <span className="text-[28px] text-black font-semibold uppercase">{data.fatherName || ""}</span>
      </div>

      <div className="absolute top-[440px] left-[320px] flex items-center">
        <span className="font-bold text-[28px] text-black w-[150px]">CLASS :</span>
        <span className="text-[28px] text-black ml-4 font-semibold uppercase">{data.className || ""}</span>
      </div>

      <div className="absolute top-[440px] left-[650px] flex items-center">
        <span className="font-bold text-[28px] text-black w-[100px]">DOB :</span>
        <span className="text-[28px] text-black ml-2 font-semibold">{formattedDob}</span>
      </div>

      <div className="absolute top-[490px] left-[320px] flex items-center">
        <span className="font-bold text-[28px] text-black w-[150px]">MOBILE :</span>
        <span className="text-[28px] text-black ml-4 font-semibold">{data.mobile || ""}</span>
      </div>

      <div className="absolute top-[540px] left-[320px] flex items-start w-[500px]">
        <span className="font-bold text-[28px] text-black w-[180px] shrink-0">ADDRESS :</span>
        <span className="text-[28px] text-black font-semibold uppercase leading-tight mt-1">{data.address || ""}</span>
      </div>

      {/* Principal Signature */}
      <div className="absolute top-[510px] left-[800px] w-[150px] flex flex-col items-center">
        {data.principalSignUrl ? (
          <img src={data.principalSignUrl} alt="Principal Signature" className="h-[60px] object-contain mb-1" />
        ) : (
          <div className="h-[60px] w-full border border-dashed border-slate-300 mb-1 flex items-center justify-center">
             <span className="text-slate-300 text-sm">Sign</span>
          </div>
        )}
        <span className="font-bold text-xl text-black">Principal Sign</span>
      </div>

      {/* Left Blue Curve & Photo */}
      <div className="absolute top-[260px] left-0 w-[270px] h-[340px] overflow-hidden">
        {/* We use an SVG curve to accurately recreate the shape */}
        <svg viewBox="0 0 270 340" className="absolute top-0 left-0 w-full h-full text-[#1A56DB] z-0" preserveAspectRatio="none">
          <path d="M0,0 Q180,170 0,340 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Photo Box */}
      <div className="absolute top-[300px] left-[50px] w-[220px] h-[270px] bg-slate-100 z-10 border-2 border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
        {data.photoUrl ? (
          <img src={data.photoUrl} alt="Student" className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-400 text-lg font-medium">PHOTO</span>
        )}
      </div>

      {/* Bottom Blue Border */}
      <div className="absolute bottom-0 left-0 w-full h-[38px] bg-[#1A56DB]"></div>
    </div>
  );
}
