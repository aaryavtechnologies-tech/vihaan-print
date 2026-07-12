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
    <div className="w-[1016px] h-[638px] bg-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-xl border border-slate-200 transform origin-top-left" style={{ zoom: 0.5 }}>
      {/* Background Watermark/Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-multiply"></div>
      
      {/* Top Banner with Gradient */}
      <div className="absolute top-0 left-0 w-full h-[260px] bg-gradient-to-r from-[#0e3b9e] via-[#1A56DB] to-[#0e3b9e] shadow-lg flex items-center justify-center text-center">
        {/* Decorative Circles */}
        <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-100px] left-[200px] w-[400px] h-[200px] bg-white/5 rounded-full blur-2xl"></div>

        {/* Logo area */}
        <div className="absolute top-[40px] left-[50px] w-[160px] h-[160px] bg-white rounded-full flex items-center justify-center border-[6px] border-white/20 shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="w-[148px] h-[148px] bg-gradient-to-br from-[#1A56DB] to-[#0e3b9e] rounded-full flex items-center justify-center shadow-inner">
            <span className="text-white font-bold text-sm text-center px-4 tracking-wider">SCHOOL<br/>LOGO</span>
          </div>
        </div>

        {/* Header Texts */}
        <div className="absolute top-[20px] left-[40px] w-[180px] text-center text-white/80 font-bold text-lg tracking-widest">
          ESTD: 2001
        </div>
        
        <div className="absolute top-[20px] left-[250px] w-[700px] text-white font-bold text-xl text-center tracking-widest drop-shadow-md">
          HIS GRACE
        </div>
        
        <div className="absolute top-[45px] left-[250px] w-[700px] text-yellow-300 italic text-2xl text-center font-serif tracking-wide drop-shadow-sm">
          "Fear of the Lord is the beginning of wisdom"
        </div>
        
        <div className="absolute top-[75px] left-[250px] w-[700px] text-white font-extrabold text-[56px] text-center uppercase tracking-tight drop-shadow-lg" style={{ fontFamily: 'Impact, sans-serif' }}>
          ST.JOHN SAMARITAN
        </div>
        
        <div className="absolute top-[138px] left-[250px] w-[700px] text-white font-bold text-[28px] text-center uppercase tracking-wide drop-shadow-md">
          ENGLISH MEDIUM PRIMARY & HIGH SCHOOL
        </div>
        
        <div className="absolute top-[180px] left-[260px] w-[680px] h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        
        <div className="absolute top-[190px] left-[250px] w-[700px] text-white/90 text-[20px] font-semibold text-center uppercase tracking-wider">
          BAPUJI COLONY ANAND NAGAR OLD HUBLI-HUBBALLI
        </div>
        
        <div className="absolute top-[220px] left-[250px] w-[700px] text-white font-bold text-[22px] text-center uppercase drop-shadow-md bg-black/20 py-1 rounded-full w-max mx-auto px-8 backdrop-blur-sm border border-white/10" style={{ transform: 'translateX(28%)' }}>
          OFFICE CONTACT NO : 9902396096 - 9663868677
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-[270px] left-[320px] w-[450px] text-center z-20">
        <div className="inline-block bg-[#D91C1C] text-white font-extrabold text-[36px] uppercase px-8 py-2 rounded-b-3xl shadow-lg border-2 border-white tracking-widest">
          ID CARD 2026-27
        </div>
      </div>

      {/* Student Data Fields */}
      <div className="absolute top-[350px] left-[320px] flex items-center bg-slate-50/50 w-[650px] py-2 px-4 rounded-xl border border-slate-100/50">
        <span className="font-bold text-[26px] text-slate-500 w-[150px] tracking-wider">NAME :</span>
        <span className="text-[28px] text-slate-900 ml-4 font-bold uppercase drop-shadow-sm">{data.studentName || "-"}</span>
      </div>

      <div className="absolute top-[405px] left-[320px] flex items-center px-4 w-[650px]">
        <span className="font-bold text-[26px] text-slate-500 w-[240px] tracking-wider">FATHER NAME :</span>
        <span className="text-[28px] text-slate-800 font-bold uppercase">{data.fatherName || "-"}</span>
      </div>

      <div className="absolute top-[460px] left-[320px] flex items-center px-4">
        <span className="font-bold text-[26px] text-slate-500 w-[150px] tracking-wider">CLASS :</span>
        <span className="text-[28px] text-slate-800 ml-4 font-bold uppercase bg-blue-50 px-4 py-1 rounded-lg border border-blue-100 text-[#1A56DB]">{data.className || "-"}</span>
      </div>

      <div className="absolute top-[460px] left-[650px] flex items-center px-4 bg-slate-50 rounded-lg py-1 border border-slate-100">
        <span className="font-bold text-[26px] text-slate-500 w-[100px] tracking-wider">DOB :</span>
        <span className="text-[28px] text-slate-800 ml-2 font-bold">{formattedDob || "-"}</span>
      </div>

      <div className="absolute top-[515px] left-[320px] flex items-center px-4">
        <span className="font-bold text-[26px] text-slate-500 w-[150px] tracking-wider">MOBILE :</span>
        <span className="text-[28px] text-slate-800 ml-4 font-bold">{data.mobile || "-"}</span>
      </div>

      <div className="absolute top-[570px] left-[320px] flex items-start w-[480px] px-4">
        <span className="font-bold text-[26px] text-slate-500 w-[160px] shrink-0 tracking-wider">ADDRESS :</span>
        <span className="text-[24px] text-slate-800 font-bold uppercase leading-tight mt-1">{data.address || "-"}</span>
      </div>

      {/* Principal Signature */}
      <div className="absolute top-[510px] left-[780px] w-[180px] flex flex-col items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60 shadow-sm">
        {data.principalSignUrl ? (
          <img src={data.principalSignUrl} alt="Principal Signature" className="h-[60px] object-contain mb-1 mix-blend-multiply" />
        ) : (
          <div className="h-[60px] w-full mb-1 flex items-center justify-center opacity-30">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>
        )}
        <div className="w-full h-[2px] bg-slate-300 mb-1 mt-1 rounded-full"></div>
        <span className="font-bold text-lg text-slate-600 uppercase tracking-widest">Principal</span>
      </div>

      {/* Left Blue Curve */}
      <div className="absolute top-[258px] left-0 w-[300px] h-[345px] overflow-hidden">
        <svg viewBox="0 0 270 340" className="absolute top-0 left-0 w-full h-full text-[#1A56DB] z-0 drop-shadow-xl" preserveAspectRatio="none">
          <path d="M0,0 Q180,170 0,345 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Photo Box */}
      <div className="absolute top-[290px] left-[50px] w-[200px] h-[250px] bg-white z-10 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] ring-4 ring-white ring-offset-2 ring-offset-[#1A56DB]">
        {data.photoUrl ? (
          <img src={data.photoUrl} alt="Student" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-xl font-bold tracking-widest uppercase">Photo</span>
          </div>
        )}
      </div>

      {/* Bottom Blue Border */}
      <div className="absolute bottom-0 left-0 w-full h-[38px] bg-gradient-to-r from-[#0e3b9e] via-[#1A56DB] to-[#0e3b9e] shadow-inner">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-multiply"></div>
      </div>
    </div>
  );
}
