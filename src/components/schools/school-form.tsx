"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Building2, Phone, MapPin, Image as ImageIcon, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { schoolSchema, SchoolFormValues } from "@/validators/school";
import { SchoolType, SchoolStatus } from "@/types/school";
import { createSchool, updateSchool } from "@/actions/schools";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/schools/image-uploader";

interface SchoolFormProps {
  initialData?: any; // To be properly typed later with Prisma School model
  isEdit?: boolean;
}

export function SchoolForm({ initialData, isEdit = false }: SchoolFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema) as any,
    defaultValues: initialData || {
      schoolName: "",
      schoolCode: "",
      schoolType: SchoolType.SECONDARY,
      email: "",
      phone: "",
      alternatePhone: "",
      website: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      establishedYear: undefined,
      board: "",
      medium: "",
      description: "",
      logo: "",
      coverImage: "",
      principalName: "",
      principalSignature: "",
      status: SchoolStatus.ACTIVE,
    },
  });

  const onSubmit = async (data: SchoolFormValues) => {
    setIsSubmitting(true);
    try {
      const result = isEdit && initialData?.id 
        ? await updateSchool(initialData.id, data)
        : await createSchool(data);

      if (result.success) {
        toast.success(isEdit ? "School updated successfully!" : "School created successfully!");
        router.push("/dashboard/schools");
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/schools">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit School" : "Create New School"}</h1>
            <p className="text-sm text-muted-foreground">
              {isEdit ? "Update the details and settings of the school." : "Add a new school to the system."}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 hidden sm:block" /> Basic Info
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4 hidden sm:block" /> Contact
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 hidden sm:block" /> Address
              </TabsTrigger>
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 hidden sm:block" /> Branding
              </TabsTrigger>
            </TabsList>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <TabsContent value="basic" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Delhi Public School" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schoolCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. DPS-01" {...field} />
                        </FormControl>
                        <FormDescription>Must be unique across the system.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schoolType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={SchoolType.PRIMARY}>Primary</SelectItem>
                            <SelectItem value={SchoolType.SECONDARY}>Secondary</SelectItem>
                            <SelectItem value={SchoolType.HIGHER_SECONDARY}>Higher Secondary</SelectItem>
                            <SelectItem value={SchoolType.COLLEGE}>College</SelectItem>
                            <SelectItem value={SchoolType.UNIVERSITY}>University</SelectItem>
                            <SelectItem value={SchoolType.OTHER}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="establishedYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Established Year</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 1995" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="board"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiliation Board</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CBSE, ICSE, State Board" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medium of Instruction</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. English" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description about the school..." 
                          className="resize-none h-24"
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="contact" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Official Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="admin@school.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9876543211" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.school.com" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="address" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1 *</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address, P.O. box, company name, c/o" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. New Delhi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Delhi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal / Zip Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 110001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. India" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="branding" className="mt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUploader 
                            label="School Logo" 
                            value={field.value} 
                            onChange={field.onChange} 
                            onRemove={() => field.onChange("")} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUploader 
                            label="Cover Image (Dashboard Header)" 
                            value={field.value} 
                            onChange={field.onChange} 
                            onRemove={() => field.onChange("")} 
                            description="Recommended ratio 16:9, up to 5MB"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="principalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Principal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Dr. A.K. Sharma" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="principalSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUploader 
                            label="Principal Signature" 
                            value={field.value} 
                            onChange={field.onChange} 
                            onRemove={() => field.onChange("")} 
                            description="Transparent PNG recommended"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex items-center gap-4 justify-end">
            <Link href="/dashboard/schools">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create School"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
