"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStudent } from "../server/student-actions";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

import { StJohnTemplatePreview, StudentCardData } from "./st-john-template-preview";
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

const STEPS = [
  { title: "Basic Details" },
  { title: "Academic" },
  { title: "Parents" },
  { title: "Contact" },
  { title: "Uploads" },
  { title: "Review" },
];

export function StudentWizard({ schools = [], isPublic = false }: { schools?: any[], isPublic?: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);
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

  const previewData: StudentCardData = {
    studentName: `${formValues.firstName || ""} ${formValues.lastName || ""}`.trim(),
    fatherName: formValues.fatherName,
    className: formValues.className,
    dob: formValues.dob,
    mobile: formValues.mobile,
    address: formValues.addressLine1,
    photoUrl: formValues.photoUrl,
    principalSignUrl: formValues.signatureUrl, // Just for demo, usually it's school signature
  };

  const nextStep = async () => {
    // In a real app, trigger partial validation based on current step
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['schoolId', 'studentId', 'firstName', 'dob'];
    if (currentStep === 1) fieldsToValidate = ['className'];
    if (currentStep === 2) fieldsToValidate = ['fatherName'];
    if (currentStep === 3) fieldsToValidate = ['mobile', 'addressLine1'];
    
    if (fieldsToValidate.length > 0) {
      const isStepValid = await methods.trigger(fieldsToValidate as any);
      if (!isStepValid) return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

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
      {/* Left: Form Area */}
      <div className="w-full lg:w-[600px] xl:w-[700px] shrink-0 space-y-6">
        <Stepper steps={STEPS} currentStep={currentStep} />
        
        <Card className="border-slate-200/60 shadow-sm">
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {currentStep === 0 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Basic Details</h3>
                    {!isPublic && (
                      <div className="space-y-2">
                          <Label>School <span className="text-red-500">*</span></Label>
                          <select {...register("schoolId")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="">Select a School</option>
                            {schools.map(school => (
                              <option key={school.id} value={school.id}>{school.schoolName}</option>
                            ))}
                          </select>
                          {errors.schoolId && <span className="text-xs text-red-500">{errors.schoolId.message}</span>}
                      </div>
                    )}
                    {!isPublic && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Student ID <span className="text-red-500">*</span></Label>
                          <Input {...register("studentId")} placeholder="e.g. STU2026001" />
                          {errors.studentId && <span className="text-xs text-red-500">{errors.studentId.message}</span>}
                        </div>
                        <div className="space-y-2">
                          <Label>Admission No</Label>
                          <Input {...register("admissionNo")} placeholder="e.g. ADM/24/001" />
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name <span className="text-red-500">*</span></Label>
                        <Input {...register("firstName")} placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input {...register("lastName")} placeholder="Doe" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date of Birth <span className="text-red-500">*</span></Label>
                        <Input type="date" {...register("dob")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <select {...register("gender")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Academic Information</h3>
                    <div className="space-y-2">
                      <Label>Class <span className="text-red-500">*</span></Label>
                      <Input {...register("className")} placeholder="e.g. 10th Grade" />
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Input {...register("section")} placeholder="e.g. A" />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Parent Information</h3>
                    <div className="space-y-2">
                      <Label>Father's Name <span className="text-red-500">*</span></Label>
                      <Input {...register("fatherName")} placeholder="Father's full name" />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Contact Information</h3>
                    <div className="space-y-2">
                      <Label>Mobile Number <span className="text-red-500">*</span></Label>
                      <Input {...register("mobile")} placeholder="e.g. 9876543210" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address <span className="text-red-500">*</span></Label>
                      <Input {...register("addressLine1")} placeholder="Full address" />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Uploads</h3>
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label>Student Photo (1.2 x 1.5 Ratio)</Label>
                        <ImageUpload 
                          value={formValues.photoUrl} 
                          onChange={(url) => methods.setValue("photoUrl", url, { shouldValidate: true })}
                          label="Upload Photo"
                          folder="vihaan_id_print/students"
                        />
                        <p className="text-xs text-slate-500">Ensure the face is clearly visible with a light background.</p>
                      </div>
                      <div className="space-y-4">
                        <Label>Signature (Optional)</Label>
                        <ImageUpload 
                          value={formValues.signatureUrl} 
                          onChange={(url) => methods.setValue("signatureUrl", url, { shouldValidate: true })}
                          label="Upload Signature"
                          folder="vihaan_id_print/signatures"
                        />
                        <p className="text-xs text-slate-500">Only needed if the student signature is printed on the card.</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Review & Submit</h3>
                    <p className="text-sm text-slate-500 mb-6">Please review the details on the right ID card preview before submitting.</p>
                    
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                      <strong>Ready to generate!</strong> Make sure all spellings are correct. The system will automatically convert names and addresses to uppercase for printing.
                    </div>
                  </div>
                )}

              </form>
            </FormProvider>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium shadow-sm disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              {currentStep < STEPS.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all font-semibold"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit(onSubmit)} 
                  disabled={isSubmitting}
                  className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all font-semibold"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Submit Details
                </Button>
              )}
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Right: Live Preview Area */}
      <div className="flex-1 sticky top-6">
        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200/60 shadow-inner flex flex-col items-center justify-center min-h-[500px]">
          <div className="mb-4 text-center">
            <h4 className="font-semibold text-slate-700">Live Card Preview</h4>
            <p className="text-xs text-slate-500">Updates instantly as you type</p>
          </div>
          
          {/* We scale the preview down to fit the panel */}
          <div className="scale-[0.6] sm:scale-[0.7] xl:scale-[0.8] origin-top">
            <StJohnTemplatePreview data={previewData} />
          </div>
        </div>
      </div>
    </div>
  );
}
