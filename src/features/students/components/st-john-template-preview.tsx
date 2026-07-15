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
  zoom?: number;
}

export function StJohnTemplatePreview({ data, zoom = 1 }: StJohnTemplatePreviewProps) {
  const formattedDob = data.dob 
    ? typeof data.dob === 'string' 
      ? data.dob 
      : format(new Date(data.dob), "dd/MM/yyyy")
    : "";

  return (
    <div className="w-[1016px] h-[638px] bg-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-xl border border-slate-200 transform origin-top-left" style={{ zoom: zoom, fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Background Watermark/Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-multiply"></div>
      
      {/* Top Banner with Gradient */}
      <div className="absolute top-0 left-0 w-full h-[180px] bg-gradient-to-r from-[#0e3b9e] via-[#1A56DB] to-[#0e3b9e] shadow-lg flex items-center justify-center text-center">
        {/* Decorative Circles */}
        <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-100px] left-[200px] w-[400px] h-[200px] bg-white/5 rounded-full blur-2xl"></div>

        {/* Logo area */}
        <div className="absolute top-[25px] left-[30px] w-[130px] h-[130px] bg-white rounded-full flex items-center justify-center border-[4px] border-white/20 shadow-xl overflow-hidden backdrop-blur-sm">
          <img src="/images/st-john-logo.png" alt="School Logo" className="w-[120px] h-[120px] object-contain rounded-full shadow-inner bg-white" crossOrigin="anonymous" />
        </div>
        
        <div className="absolute top-[160px] left-[30px] w-[130px] text-center text-white/90 font-bold text-sm tracking-widest bg-black/30 rounded-b-md px-1 py-0.5">
          ESTD: 2001
        </div>

        {/* Header Texts */}
        <div className="absolute top-[10px] left-[170px] w-[800px] text-white font-bold text-lg text-center tracking-widest drop-shadow-md">
          HIS GRACE
        </div>
        
        <div className="absolute top-[35px] left-[170px] w-[800px] text-yellow-300 italic text-xl text-center font-serif tracking-wide drop-shadow-sm">
          "Fear of the Lord is the beginning of wisdom"
        </div>
        
        <div className="absolute top-[60px] left-[170px] w-[800px] text-white font-extrabold text-[46px] text-center uppercase tracking-tight drop-shadow-lg leading-none" style={{ fontFamily: 'Impact, Arial, sans-serif' }}>
          ST.JOHN SAMARITAN
        </div>
        
        <div className="absolute top-[110px] left-[170px] w-[800px] text-white font-bold text-[22px] text-center uppercase tracking-wide drop-shadow-md">
          ENGLISH MEDIUM PRIMARY & HIGH SCHOOL
        </div>
        
        <div className="absolute top-[138px] left-[180px] w-[780px] h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        
        <div className="absolute top-[145px] left-[170px] w-[800px] flex items-center justify-center gap-4 text-white/95 text-[16px] font-semibold text-center uppercase tracking-wider drop-shadow-md">
          <span>BAPUJI COLONY ANAND NAGAR OLD HUBLI-HUBBALLI</span>
          <span className="bg-black/20 px-3 py-0.5 rounded-full border border-white/10">PH : 9902396096 - 9663868677</span>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-[200px] left-[420px] w-[560px] flex justify-center z-20">
        <div className="inline-block bg-[#D91C1C] text-white font-extrabold text-[32px] uppercase px-8 py-2 rounded-2xl shadow-lg border-2 border-white tracking-widest">
          ID CARD 2026-27
        </div>
      </div>

      {/* Student Data Fields */}
      <div className="absolute top-[280px] left-[420px] flex items-center bg-slate-50/50 w-[560px] py-2 px-4 rounded-xl border border-slate-100/50">
        <span className="font-bold text-[24px] text-slate-500 w-[140px] tracking-wider uppercase">Name :</span>
        <span className="text-[33px] text-[#FF0000] ml-2 font-bold uppercase drop-shadow-sm leading-none flex-1 truncate">{data.studentName || "-"}</span>
      </div>

      <div className="absolute top-[340px] left-[420px] flex items-center px-4 w-[560px]">
        <span className="font-bold text-[24px] text-slate-500 w-[200px] tracking-wider uppercase">Father Name :</span>
        <span className="text-[29px] text-[#0000FF] font-normal uppercase leading-none flex-1 truncate">{data.fatherName || "-"}</span>
      </div>

      <div className="absolute top-[395px] left-[420px] flex items-center px-4 w-[280px]">
        <span className="font-bold text-[24px] text-slate-500 w-[100px] tracking-wider uppercase">Class :</span>
        <span className="text-[33px] text-[#FF0000] font-normal uppercase bg-red-50 px-3 py-1 rounded-lg border border-red-100 leading-none truncate max-w-[150px]">{data.className || "-"}</span>
      </div>

      <div className="absolute top-[395px] left-[710px] flex items-center px-4 bg-blue-50 rounded-lg py-1 border border-blue-100 w-[270px]">
        <span className="font-bold text-[24px] text-slate-500 w-[75px] tracking-wider uppercase">DOB :</span>
        <span className="text-[29px] text-[#0000FF] ml-1 font-normal uppercase leading-none flex-1 truncate">{formattedDob || "-"}</span>
      </div>

      <div className="absolute top-[455px] left-[420px] flex items-center px-4 w-[560px]">
        <span className="font-bold text-[24px] text-slate-500 w-[120px] tracking-wider uppercase">Mobile :</span>
        <span className="text-[29px] text-[#FF0000] ml-2 font-normal uppercase leading-none">{data.mobile || "-"}</span>
      </div>

      <div className="absolute top-[505px] left-[420px] flex items-start w-[380px] px-4">
        <span className="font-bold text-[24px] text-slate-500 w-[120px] shrink-0 tracking-wider uppercase">Address :</span>
        <span className="text-[21px] text-[#FF0000] font-normal uppercase leading-tight mt-1 ml-2 max-h-[80px] overflow-hidden">{data.address || "-"}</span>
      </div>

      {/* Principal Signature */}
      <div className="absolute top-[520px] left-[810px] w-[170px] flex flex-col items-center bg-slate-50 p-2 rounded-xl border border-slate-200/60 shadow-sm z-30">
        <img src="/images/principal-sign.png" alt="Principal Signature" className="h-[50px] object-contain mb-1 mix-blend-multiply" crossOrigin="anonymous" />
        <div className="w-full h-[2px] bg-slate-300 mb-1 mt-1 rounded-full"></div>
        <span className="font-bold text-base text-slate-600 uppercase tracking-widest">Principal</span>
      </div>

      {/* Left Blue Curve */}
      <div className="absolute top-[260px] left-0 w-[300px] h-[345px] overflow-hidden">
        <svg viewBox="0 0 270 340" className="absolute top-0 left-0 w-full h-full text-[#1A56DB] z-0 drop-shadow-xl" preserveAspectRatio="none">
          <path d="M0,0 Q180,170 0,345 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Photo Box: 1.2x1.5 inches at 300 DPI = 360x450 pixels */}
      <div className="absolute top-[150px] left-[35px] w-[360px] h-[450px] bg-white z-10 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] ring-4 ring-white ring-offset-2 ring-offset-[#1A56DB]">
        {data.photoUrl ? (
          <img src={data.photoUrl} alt="Student" className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" crossOrigin="anonymous" />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-xl font-bold tracking-widest uppercase">1.2x1.5"</span>
          </div>
        )}
      </div>

      {/* Bottom Blue Border */}
      <div className="absolute bottom-0 left-0 w-full h-[38px] bg-gradient-to-r from-[#0e3b9e] via-[#1A56DB] to-[#0e3b9e] shadow-inner z-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-multiply"></div>
      </div>
    </div>
  );
}
