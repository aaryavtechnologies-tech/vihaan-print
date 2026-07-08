import { Building2, Mail, Phone, Globe, MapPin, Calendar, FileText, BadgeCheck, Users, Printer, LayoutTemplate, MoreHorizontal, Pencil, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import type { School } from "@prisma/client";
import { SchoolStatus } from "@/types/school";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SchoolProfileProps {
  school: School;
}

export function SchoolProfile({ school }: SchoolProfileProps) {
  const getStatusBadge = (status: SchoolStatus) => {
    switch (status) {
      case SchoolStatus.ACTIVE:
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20">Active</Badge>;
      case SchoolStatus.INACTIVE:
        // @ts-ignore
        return <Badge variant="secondary" className="cursor-pointer" asChild>Inactive</Badge>;
      case SchoolStatus.ARCHIVED:
        return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/schools" className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Schools
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/schools/${school.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-2" /> Edit School
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-9 px-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Archive School</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete School</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cover Image & Profile Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border shadow-sm">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-slate-100 dark:bg-slate-800 relative">
          {school.coverImage ? (
            <Image src={school.coverImage} alt="Cover" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-90" />
          )}
        </div>
        
        {/* Profile Info Overlay */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 relative z-10">
            {/* Logo */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white dark:bg-slate-900 rounded-2xl border-4 border-white dark:border-slate-950 shadow-md flex items-center justify-center overflow-hidden shrink-0 p-2">
              {school.logo ? (
                <div className="relative w-full h-full">
                  <Image src={school.logo} alt={school.schoolName} fill className="object-contain" />
                </div>
              ) : (
                <Building2 className="w-16 h-16 text-slate-300" />
              )}
            </div>
            
            {/* Name & Basic details */}
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{school.schoolName}</h1>
                {getStatusBadge(school.status)}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                  Code: {school.schoolCode}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {school.city}, {school.state}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  {school.schoolType.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Stats & Contact */}
        <div className="space-y-6 lg:col-span-1">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
              <CardContent className="p-4 flex flex-col items-center text-center justify-center">
                <Users className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">0</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Students</span>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
              <CardContent className="p-4 flex flex-col items-center text-center justify-center">
                <Printer className="w-6 h-6 text-emerald-500 mb-2" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">0</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Printed IDs</span>
              </CardContent>
            </Card>
            <Card className="bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30">
              <CardContent className="p-4 flex flex-col items-center text-center justify-center">
                <LayoutTemplate className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">0</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Templates</span>
              </CardContent>
            </Card>
            <Card className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
              <CardContent className="p-4 flex flex-col items-center text-center justify-center">
                <FileText className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">0 MB</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Storage</span>
              </CardContent>
            </Card>
          </div>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <a href={`mailto:${school.email}`} className="text-sm text-blue-600 hover:underline">{school.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Primary Phone</p>
                  <a href={`tel:${school.phone}`} className="text-sm text-slate-600 dark:text-slate-300">{school.phone}</a>
                </div>
              </div>
              {school.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {school.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details & Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent data-[state=active]:shadow-none px-6 py-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent data-[state=active]:shadow-none px-6 py-3">
                Templates
              </TabsTrigger>
              <TabsTrigger value="students" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent data-[state=active]:shadow-none px-6 py-3">
                Students
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent data-[state=active]:shadow-none px-6 py-3">
                Print History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 outline-none">
              {school.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {school.description}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Address Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {school.addressLine1}
                      {school.addressLine2 && <><br />{school.addressLine2}</>}
                      <br />
                      {school.city}, {school.state} {school.postalCode}
                      <br />
                      {school.country}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Academic Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-slate-500">Established</span>
                      <span className="text-sm font-medium">{school.establishedYear || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-slate-500">Affiliation Board</span>
                      <span className="text-sm font-medium">{school.board || "N/A"}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-sm text-slate-500">Medium</span>
                      <span className="text-sm font-medium">{school.medium || "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Principal Signature */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Administration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-500 mb-1">Principal Name</p>
                      <p className="text-base font-semibold">{school.principalName || "Not provided"}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-500 mb-2">Digital Signature</p>
                      <div className="h-20 w-48 bg-slate-50 dark:bg-slate-900 rounded border flex items-center justify-center p-2 relative">
                        {school.principalSignature ? (
                          <Image src={school.principalSignature} alt="Signature" fill className="object-contain p-2" />
                        ) : (
                          <span className="text-xs text-slate-400 italic">No signature uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            <TabsContent value="templates" className="outline-none">
              <Card className="border-dashed bg-slate-50/50 dark:bg-slate-900/20">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <LayoutTemplate className="w-12 h-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Templates Found</h3>
                  <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
                    Design custom ID card templates specific to {school.schoolName}.
                  </p>
                  <Button variant="outline">Create Template</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="outline-none">
              <Card className="border-dashed bg-slate-50/50 dark:bg-slate-900/20">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Users className="w-12 h-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Students Found</h3>
                  <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
                    Import or add students to generate their ID cards.
                  </p>
                  <Button variant="outline">Import Students</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="outline-none">
              <Card className="border-dashed bg-slate-50/50 dark:bg-slate-900/20">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Printer className="w-12 h-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Print History</h3>
                  <p className="text-sm text-slate-500 text-center max-w-sm">
                    Records of all generated and downloaded ID card batches will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
