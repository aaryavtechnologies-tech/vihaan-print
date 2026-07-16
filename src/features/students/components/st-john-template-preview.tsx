
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
    <div 
      className="bg-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-xl border border-slate-200 transform origin-top-left shrink-0" 
      style={{ width: 1016, height: 638, minWidth: 1016, minHeight: 638, zoom: zoom, fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Background Watermark/Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-multiply"></div>
      
      {/* Top Banner with Gradient */}
      <div className="absolute top-0 left-0 w-full h-[230px] bg-[#0e4ee5] shadow-lg flex items-center justify-center text-center">
        {/* Decorative Circles */}
        <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-100px] left-[200px] w-[400px] h-[200px] bg-white/5 rounded-full blur-2xl"></div>

        {/* ESTD Text */}
        <div className="absolute text-white font-bold text-[20px] tracking-widest text-center" style={{ top: 20, left: 20, width: 350 }}>
          ESTD:2001
        </div>

        {/* Logo area */}
        <div className="absolute flex items-center justify-center overflow-hidden" style={{ top: 40, left: 20, width: 350, height: 230 }}>
          <img src="/images/st-john-logo.png" alt="School Logo" className="object-contain drop-shadow-xl w-full h-full" />
        </div>

        {/* Header Texts */}
        <div className="absolute text-white font-bold text-[20px] text-center tracking-widest drop-shadow-md" style={{ top: 15, left: 380, width: 616 }}>
          H<span style={{ fontSize: '24px', verticalAlign: 'middle', margin: '0 2px' }}>†</span>S GRACE
        </div>
        
        <div className="absolute text-white font-bold text-[18px] text-center tracking-wide drop-shadow-sm" style={{ top: 40, left: 380, width: 616 }}>
          "Fear of the Lord is the beginning of the wisdom"
        </div>
        
        <div className="absolute text-white font-extrabold text-[52px] text-center uppercase tracking-tight drop-shadow-lg leading-none" style={{ top: 65, left: 380, width: 616, fontFamily: 'Arial Black, Impact, sans-serif' }}>
          ST.JOHN SAMARITAN
        </div>
        
        <div className="absolute text-white font-bold text-[20px] text-center uppercase tracking-wide drop-shadow-md" style={{ top: 130, left: 380, width: 616 }}>
          ENGLISH MEDIUM PRIMARY &amp; HIGH SCHOOL
        </div>
        
        <div className="absolute bg-white" style={{ top: 165, left: 400, width: 566, height: 3 }}></div>
        
        <div className="absolute flex flex-col items-center justify-center text-white text-[16px] font-semibold text-center uppercase tracking-wider drop-shadow-md" style={{ top: 175, left: 380, width: 616, lineHeight: '1.2' }}>
          <span>NEAR BYPASS NEKAR NAGAR OLD HUBLI-HUBBALLI</span>
          <span>OFFICE CONTACT NO : 7892788532 - 8970349780</span>
        </div>
      </div>

      {/* Left Blue Curve */}
      <div className="absolute overflow-hidden" style={{ top: 230, left: 0, width: 100, height: 408 }}>
        <svg viewBox="0 0 100 408" className="absolute top-0 left-0 w-full h-full text-[#0e4ee5] z-0" preserveAspectRatio="none">
          <path d="M0,0 Q100,204 0,408 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Title */}
      <div className="absolute flex justify-center z-20" style={{ top: 240, left: 320, width: 650 }}>
        <div className="text-[#D91C1C] font-extrabold text-[36px] uppercase tracking-widest" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
          ID CARD 2026-27
        </div>
      </div>

      {/* Student Data Fields */}
      <div className="absolute flex items-center" style={{ top: 300, left: 320, width: 650 }}>
        <span className="font-bold text-[20px] text-black w-[150px] shrink-0 uppercase tracking-widest">NAME :</span>
        <span className="text-[20px] text-black font-bold uppercase leading-none flex-1 truncate">{data.studentName || ""}</span>
      </div>

      <div className="absolute flex items-center" style={{ top: 360, left: 320, width: 650 }}>
        <span className="font-bold text-[20px] text-black w-[220px] shrink-0 uppercase tracking-widest">FATHER NAME :</span>
        <span className="text-[20px] text-black font-bold uppercase leading-none flex-1 truncate">{data.fatherName || ""}</span>
      </div>

      <div className="absolute flex items-center" style={{ top: 420, left: 320, width: 350 }}>
        <span className="font-bold text-[20px] text-black w-[120px] shrink-0 uppercase tracking-widest">CLASS :</span>
        <span className="text-[20px] text-black font-bold uppercase leading-none flex-1 truncate">{data.className || ""}</span>
      </div>

      <div className="absolute flex items-center" style={{ top: 420, left: 680, width: 300 }}>
        <span className="font-bold text-[20px] text-black w-[90px] shrink-0 uppercase tracking-widest">DOB :</span>
        <span className="text-[20px] text-black font-bold uppercase leading-none flex-1 truncate">{formattedDob || ""}</span>
      </div>

      <div className="absolute flex items-center" style={{ top: 480, left: 320, width: 650 }}>
        <span className="font-bold text-[20px] text-black w-[140px] shrink-0 uppercase tracking-widest">MOBILE :</span>
        <span className="text-[20px] text-black font-bold uppercase leading-none flex-1 truncate">{data.mobile || ""}</span>
      </div>

      <div className="absolute flex items-start" style={{ top: 530, left: 320, width: 450 }}>
        <span className="font-bold text-[20px] text-black w-[160px] shrink-0 uppercase tracking-widest">ADDRESS :</span>
        <span className="text-[18px] text-black font-bold uppercase leading-tight flex-1 break-words">{data.address || ""}</span>
      </div>

      {/* Principal Signature */}
      <div className="absolute flex flex-col items-center justify-center z-30" style={{ top: 490, left: 800, width: 166, height: 100 }}>
        {data.principalSignUrl ? (
           <img src={data.principalSignUrl} alt="Principal Signature" className="object-contain w-full h-full" crossOrigin="anonymous" />
        ) : (
           <img src="/images/principal-sign.png" alt="Principal Signature" className="object-contain w-full h-full" />
        )}
      </div>

      {/* Photo Box */}
      <div className="absolute bg-transparent z-10 overflow-hidden flex items-center justify-center border-[6px] border-solid border-black" style={{ top: 260, left: 50, width: 200, height: 260 }}>
        {data.photoUrl ? (
          <img src={data.photoUrl} alt="Student" className="w-full h-full object-cover object-top" crossOrigin="anonymous" />
        ) : (
           <span className="text-slate-400 font-bold uppercase text-sm tracking-widest text-center px-4">Student<br/>Photo</span>
        )}
      </div>

      {/* Bottom Blue Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[30px] bg-[#0e4ee5] z-20"></div>
    </div>
  );
}
