"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStudent } from "../server/student-actions";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

import { StJohnTemplatePreview } from "@/features/students/components/st-john-template-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const studentSchema = z.object({
  schoolId: z.string().optional(),
  studentId: z.string().optional(),
  admissionNo: z.string().optional(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  dob: z.string().min(1, "Date of Birth is required"),
  gender: z.string().optional(),
  className: z.string().min(1, "Class is required"),
  section: z.string().optional(),
  fatherName: z.string().min(1, "Father's Name is required"),
  mobile: z.string().min(10, "Valid mobile required"),
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  photoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function StudentWizard({ schools = [], isPublic = false }: { schools?: any[], isPublic?: boolean }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const methods = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      schoolId: "",
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

  const { handleSubmit, watch, register, formState: { errors } } = methods;
  
  const formValues = watch();

  const previewData = {
    studentName: `${formValues.firstName || ""} ${formValues.lastName || ""}`.trim(),
    fatherName: formValues.fatherName || "",
    className: formValues.className || "",
    dob: formValues.dob || "",
    mobile: formValues.mobile || "",
    address: formValues.addressLine1 || "",
    photoUrl: formValues.photoUrl || "",
  };

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      const res = await createStudent(data);
      if (res.success) {
        if (isPublic) {
          setIsSuccess(true);
        } else {
          toast.success("Student added successfully!");
          router.push("/dashboard/students");
        }
      } else {
        toast.error(res.error || "Failed to add student");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && isPublic) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <Save className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
        <p className="text-lg text-slate-600">Your details have been submitted.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Right/Top on mobile: Live Preview Area */}
      <div className="w-full lg:flex-1 lg:sticky lg:top-6 order-1 lg:order-2">
        <div className="bg-slate-900 p-4 md:p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[300px] lg:min-h-[500px] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="mb-6 text-center relative z-10">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-3 backdrop-blur-sm border border-white/10">
              <CreditCard className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-white pr-2">Live ID Card Preview</span>
            </div>
            <p className="text-xs text-slate-400">Updates instantly as you type your details</p>
          </div>
          
          <div className="w-full overflow-hidden flex justify-center items-center relative z-10 pb-4">
            <div className="scale-[0.35] xs:scale-[0.45] sm:scale-[0.6] md:scale-[0.7] xl:scale-[0.8] origin-top md:origin-center transition-all duration-300">
              <StJohnTemplatePreview data={previewData} zoom={1} />
            </div>
          </div>
        </div>
      </div>

      {/* Left/Bottom on mobile: Form Area */}
      <div className="w-full lg:w-[600px] xl:w-[700px] shrink-0 space-y-6 order-2 lg:order-1">
        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl">
          <CardContent className="p-6 md:p-8">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Hidden inputs to explicitly register the fields so watch() catches their updates from setValue */}
                <input type="hidden" {...register("photoUrl")} />
                <input type="hidden" {...register("signatureUrl")} />
                
                {/* Basic Details */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                    <h3 className="text-xl font-bold text-slate-800">Basic Details</h3>
                  </div>
                  
                  <div className="grid gap-6">
                    {!isPublic && (
                      <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold">School <span className="text-red-500">*</span></Label>
                          <select {...register("schoolId")} className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20">
                            <option value="">Select a School</option>
                            {schools.map(school => (
                              <option key={school.id} value={school.id}>{school.schoolName}</option>
                            ))}
                          </select>
                          {errors.schoolId && <span className="text-xs text-red-500 font-medium">{errors.schoolId.message}</span>}
                      </div>
                    )}

                    {!isPublic && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold">Student ID <span className="text-red-500">*</span></Label>
                          <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("studentId")} placeholder="e.g. STU2026001" />
                          {errors.studentId && <span className="text-xs text-red-500 font-medium">{errors.studentId.message}</span>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold">Admission No</Label>
                          <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("admissionNo")} placeholder="e.g. ADM/24/001" />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">First Name <span className="text-red-500">*</span></Label>
                        <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("firstName")} placeholder="First name" />
                        {errors.firstName && <span className="text-xs text-red-500 font-medium">{errors.firstName.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Last Name</Label>
                        <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("lastName")} placeholder="Last name" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Date of Birth <span className="text-red-500">*</span></Label>
                        <Input className="h-12 rounded-xl border-slate-200 bg-white" type="text" placeholder="DD/MM/YYYY" {...register("dob")} />
                        {errors.dob && <span className="text-xs text-red-500 font-medium">{errors.dob.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Gender</Label>
                        <select {...register("gender")} className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                    <h3 className="text-xl font-bold text-slate-800">Academic & Family</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Class / Grade <span className="text-red-500">*</span></Label>
                      <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("className")} placeholder="e.g. 10th Grade" />
                      {errors.className && <span className="text-xs text-red-500 font-medium">{errors.className.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Section</Label>
                      <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("section")} placeholder="e.g. A" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Father's Name <span className="text-red-500">*</span></Label>
                    <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("fatherName")} placeholder="Father's full name" />
                    {errors.fatherName && <span className="text-xs text-red-500 font-medium">{errors.fatherName.message}</span>}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">3</div>
                    <h3 className="text-xl font-bold text-slate-800">Contact Details</h3>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Mobile Number <span className="text-red-500">*</span></Label>
                      <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("mobile")} placeholder="e.g. 9876543210" />
                      {errors.mobile && <span className="text-xs text-red-500 font-medium">{errors.mobile.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Full Address <span className="text-red-500">*</span></Label>
                      <Input className="h-12 rounded-xl border-slate-200 bg-white" {...register("addressLine1")} placeholder="House no, Street, City" />
                      {errors.addressLine1 && <span className="text-xs text-red-500 font-medium">{errors.addressLine1.message}</span>}
                    </div>
                  </div>
                </div>

                {/* Uploads */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">4</div>
                    <h3 className="text-xl font-bold text-slate-800">Photos</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <Label className="text-slate-700 font-semibold">Student Photo</Label>
                      <ImageUpload 
                        value={formValues.photoUrl} 
                        onChange={(url) => methods.setValue("photoUrl", url, { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
                        label="Upload Photo"
                        folder="vihaan_id_print/students"
                      />
                      <p className="text-xs text-slate-500">Ensure the face is clearly visible with a light background.</p>
                    </div>
                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <Label className="text-slate-700 font-semibold">Signature (Optional)</Label>
                      <ImageUpload 
                        value={formValues.signatureUrl} 
                        onChange={(url) => methods.setValue("signatureUrl", url, { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
                        label="Upload Signature"
                        folder="vihaan_id_print/signatures"
                      />
                      <p className="text-xs text-slate-500">Only needed if the student signature is printed on the card.</p>
                    </div>
                  </div>
                </div>

                {/* Submit Area */}
                <div className="pt-8 mt-8 border-t border-slate-200">
                  <div className="bg-blue-50/80 border border-blue-100 text-blue-800 p-5 rounded-2xl text-sm mb-6 flex items-start gap-3">
                    <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <p><strong>Double check your details!</strong> Make sure all spellings are correct. The information you provide will be directly printed on the ID Card.</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all font-bold text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-3" />
                        Submit & Generate ID Card
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
