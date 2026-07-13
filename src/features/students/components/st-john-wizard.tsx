"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStudent } from "../server/student-actions";
import { toast } from "sonner";
import { ImageUploadWithBgRemoval } from "@/components/ui/image-upload-with-bg-removal";

import { StJohnTemplatePreview, StudentCardData } from "./st-john-template-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Auto uppercase transformation in Zod or handle it on change. 
// We will transform string values to uppercase in zod schema and input values.
const studentSchema = z.object({
  schoolId: z.string().optional(),
  studentId: z.string().optional(),
  admissionNo: z.string().optional(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  dob: z.string().min(1, "Date of Birth is required"), 
  className: z.string().min(1, "Class is required"),
  fatherName: z.string().min(1, "Father's Name is required"),
  mobile: z.string().min(10, "Valid mobile required"),
  addressLine1: z.string().min(1, "Address is required"),
  photoUrl: z.string().min(1, "Photo is required"),
  signatureUrl: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function StJohnWizard() {
  const [wizardStep, setWizardStep] = useState<"filling" | "previewing">("filling");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const methods = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      schoolId: "", // Will be assigned on server or hidden
      studentId: "",
      firstName: "",
      lastName: "",
      dob: "",
      className: "",
      fatherName: "",
      mobile: "",
      addressLine1: "",
      photoUrl: "",
      signatureUrl: "",
    },
    mode: "onChange"
  });

  const { handleSubmit, watch, register, setValue, reset, formState: { errors } } = methods;
  
  const formValues = watch();

  // Helper to force uppercase on input
  const handleUppercaseChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: any) => {
    setValue(fieldName, e.target.value.toUpperCase(), { shouldValidate: true, shouldDirty: true });
  };

  const previewData: StudentCardData = {
    studentName: `${formValues.firstName || ""} ${formValues.lastName || ""}`.trim().toUpperCase(),
    fatherName: formValues.fatherName?.toUpperCase(),
    className: formValues.className?.toUpperCase(),
    dob: formValues.dob,
    mobile: formValues.mobile,
    address: formValues.addressLine1?.toUpperCase(),
    photoUrl: formValues.photoUrl,
    principalSignUrl: formValues.signatureUrl,
  };

  const onFormValid = (data: StudentFormData) => {
    // Instead of submitting, move to preview step
    setWizardStep("previewing");
  };

  const confirmAndSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = methods.getValues();
      // In a real app we'd fetch the actual St John school ID from DB.
      // For this demo, let's assign a mock or pass STJOHN-9780.
      data.schoolId = "STJOHN-9780"; 
      const res = await createStudent(data);
      if (res.success) {
        setIsSuccess(true);
      } else {
        toast.error(res.error || "Failed to add student");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [previewScale, setPreviewScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wizardStep !== "previewing") return;
    
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const newScale = Math.min(width / 1016, 1); 
        setPreviewScale(newScale);
      }
    };
    
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [wizardStep]);

  const handleReset = () => {
    reset();
    setWizardStep("filling");
    setIsSuccess(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <Save className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
        <p className="text-lg text-slate-600 mb-6">Your details have been submitted and the ID card is ready for printing.</p>
        <Button onClick={handleReset} variant="outline" className="px-8 h-12">Submit Another Student</Button>
      </div>
    );
  }

  if (wizardStep === "previewing") {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 md:p-10 flex flex-col items-center">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Preview ID Card</h2>
              <p className="text-slate-500 mt-2">Please verify that all details look correct on the card before submitting.</p>
            </div>
            
            <div className="bg-slate-100 p-4 sm:p-8 rounded-2xl w-full mb-8 shadow-inner border border-slate-200 flex justify-center">
              <div ref={containerRef} className="w-full max-w-[1016px] flex justify-center overflow-hidden">
                <div 
                  style={{ 
                    width: `${1016 * previewScale}px`, 
                    height: `${638 * previewScale}px`,
                    position: "relative"
                  }}
                >
                  <div 
                    className="absolute top-0 left-0 origin-top-left" 
                    style={{ 
                      transform: `scale(${previewScale})`,
                      width: "1016px",
                      height: "638px"
                    }}
                  >
                    <StJohnTemplatePreview data={previewData} zoom={1} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
               <Button 
                 variant="outline" 
                 onClick={() => setWizardStep("filling")}
                 disabled={isSubmitting}
                 className="flex-1 h-14 rounded-xl text-lg font-semibold"
               >
                 Edit Details
               </Button>
               <Button 
                 onClick={confirmAndSubmit}
                 disabled={isSubmitting}
                 className="flex-1 h-14 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl font-bold text-lg"
               >
                 {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                 Confirm & Submit
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl">
        <CardContent className="p-6 md:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Student Details</h2>
            <p className="text-slate-500 mt-2">Fill in the details below. All fields will be auto-capitalized for printing.</p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormValid)} className="space-y-12">
              
              <input type="hidden" {...register("photoUrl")} />
              <input type="hidden" {...register("signatureUrl")} />
              
              {/* Basic Details */}
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                  <h3 className="text-xl font-bold text-slate-800">Basic Details</h3>
                </div>
                
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">First Name <span className="text-red-500">*</span></Label>
                      <Input 
                        className="h-12 rounded-xl border-slate-200 bg-white uppercase" 
                        {...register("firstName")} 
                        onChange={(e) => handleUppercaseChange(e, "firstName")}
                        placeholder="FIRST NAME" 
                      />
                      {errors.firstName && <span className="text-xs text-red-500 font-medium">{errors.firstName.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Last Name</Label>
                      <Input 
                        className="h-12 rounded-xl border-slate-200 bg-white uppercase" 
                        {...register("lastName")} 
                        onChange={(e) => handleUppercaseChange(e, "lastName")}
                        placeholder="LAST NAME" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Date of Birth <span className="text-red-500">*</span></Label>
                      <Input className="h-12 rounded-xl border-slate-200 bg-white" type="date" {...register("dob")} />
                      {errors.dob && <span className="text-xs text-red-500 font-medium">{errors.dob.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Class / Grade <span className="text-red-500">*</span></Label>
                      <Input 
                        className="h-12 rounded-xl border-slate-200 bg-white uppercase" 
                        {...register("className")} 
                        onChange={(e) => handleUppercaseChange(e, "className")}
                        placeholder="E.G. 10TH GRADE" 
                      />
                      {errors.className && <span className="text-xs text-red-500 font-medium">{errors.className.message}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic & Family Information */}
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                  <h3 className="text-xl font-bold text-slate-800">Family & Contact</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Father's Name <span className="text-red-500">*</span></Label>
                    <Input 
                      className="h-12 rounded-xl border-slate-200 bg-white uppercase" 
                      {...register("fatherName")} 
                      onChange={(e) => handleUppercaseChange(e, "fatherName")}
                      placeholder="FATHER'S FULL NAME" 
                    />
                    {errors.fatherName && <span className="text-xs text-red-500 font-medium">{errors.fatherName.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Mobile Number <span className="text-red-500">*</span></Label>
                    <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("mobile")} placeholder="e.g. 9876543210" />
                    {errors.mobile && <span className="text-xs text-red-500 font-medium">{errors.mobile.message}</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Full Address <span className="text-red-500">*</span></Label>
                  <Input 
                    className="h-12 rounded-xl border-slate-200 bg-white uppercase" 
                    {...register("addressLine1")} 
                    onChange={(e) => handleUppercaseChange(e, "addressLine1")}
                    placeholder="HOUSE NO, STREET, CITY" 
                  />
                  {errors.addressLine1 && <span className="text-xs text-red-500 font-medium">{errors.addressLine1.message}</span>}
                </div>
              </div>

              {/* Uploads */}
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">3</div>
                  <h3 className="text-xl font-bold text-slate-800">Student Photo</h3>
                </div>

                <div className="grid gap-8">
                  <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <Label className="text-slate-700 font-semibold text-base">Upload & Adjust Photo <span className="text-red-500">*</span></Label>
                    <div className="max-w-3xl">
                      <ImageUploadWithBgRemoval 
                        value={formValues.photoUrl} 
                        onChange={(url) => methods.setValue("photoUrl", url, { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
                        label="Click or drag photo here"
                        folder="vihaan_id_print/students"
                      />
                    </div>
                    {errors.photoUrl && <span className="text-xs text-red-500 font-medium block">{errors.photoUrl.message}</span>}
                    <p className="text-sm text-slate-500 max-w-lg leading-relaxed mt-2">
                      Please ensure the student's face is clearly visible. You can adjust brightness and contrast after selecting the image.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Area */}
              <div className="pt-8 mt-8 border-t border-slate-200">
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all font-bold text-lg"
                >
                  Review ID Card Preview
                </Button>
              </div>

            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
