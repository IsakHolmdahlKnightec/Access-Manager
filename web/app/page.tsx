import Link from "next/link";
import { Shield, Key, Users, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[70vh] bg-gradient-primary overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary-container)_0%,_transparent_70%)]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Hero Icon */}
            <div className="mb-8 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
              <Shield className="w-16 h-16 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-display-lg md:text-display-lg text-white mb-6">
              Access Manager
            </h1>
            
            {/* Tagline */}
            <p className="text-headline-sm md:text-headline-md text-white/90 mb-8 max-w-2xl leading-relaxed">
              Secure, efficient, and user-friendly access management for your organization. 
              Streamline permissions, track access requests, and maintain security with ease.
            </p>
            
            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-title-md font-semibold shadow-elevated transition-all duration-200 hover:scale-105"
            >
              <Link href="#features">
                Explore Features
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-headline-lg md:text-headline-lg text-on-surface mb-4">
              Key Features
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Everything you need to manage access permissions effectively
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1: Secure Access */}
            <div className="group p-8 rounded-xl bg-surface-container-lowest transition-all duration-200 hover:bg-surface-container-low hover:shadow-ambient">
              <div className="w-14 h-14 rounded-xl bg-primary-container flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110">
                <Lock className="w-7 h-7 text-on-primary-container" />
              </div>
              <h3 className="text-title-lg font-semibold text-on-surface mb-3">
                Secure Access Control
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Granular permission management with role-based access control. 
                Ensure users only access what they need.
              </p>
            </div>

            {/* Feature 2: User Management */}
            <div className="group p-8 rounded-xl bg-surface-container-lowest transition-all duration-200 hover:bg-surface-container-low hover:shadow-ambient">
              <div className="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110">
                <Users className="w-7 h-7 text-on-secondary-container" />
              </div>
              <h3 className="text-title-lg font-semibold text-on-surface mb-3">
                User Management
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Efficiently manage users, groups, and departments. 
                Streamlined onboarding and offboarding processes.
              </p>
            </div>

            {/* Feature 3: Access Requests */}
            <div className="group p-8 rounded-xl bg-surface-container-lowest transition-all duration-200 hover:bg-surface-container-low hover:shadow-ambient">
              <div className="w-14 h-14 rounded-xl bg-tertiary-container flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110">
                <Key className="w-7 h-7 text-on-tertiary-container" />
              </div>
              <h3 className="text-title-lg font-semibold text-on-surface mb-3">
                Access Requests
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Streamlined request workflows with automated approvals. 
                Track requests from submission to resolution.
              </p>
            </div>

            {/* Feature 4: Audit & Compliance */}
            <div className="group p-8 rounded-xl bg-surface-container-lowest transition-all duration-200 hover:bg-surface-container-low hover:shadow-ambient">
              <div className="w-14 h-14 rounded-xl bg-info-container flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110">
                <Clock className="w-7 h-7 text-on-info-container" />
              </div>
              <h3 className="text-title-lg font-semibold text-on-surface mb-3">
                Audit & Compliance
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Comprehensive audit trails and compliance reporting. 
                Maintain visibility into all access activities.
              </p>
            </div>

            {/* Feature 5: Self-Service */}
            <div className="group p-8 rounded-xl bg-surface-container-lowest transition-all duration-200 hover:bg-surface-container-low hover:shadow-ambient md:col-span-2 lg:col-span-2">
              <div className="w-14 h-14 rounded-xl bg-success-container flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110">
                <Shield className="w-7 h-7 text-on-success-container" />
              </div>
              <h3 className="text-title-lg font-semibold text-on-surface mb-3">
                Self-Service Portal
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed max-w-xl">
                Empower users with a self-service portal for managing their own access, 
                viewing permissions, and requesting new access. Reduce IT burden while 
                maintaining security and compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
