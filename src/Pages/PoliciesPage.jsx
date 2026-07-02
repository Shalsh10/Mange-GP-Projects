import React from 'react';
import { 
  FaBookOpen, 
  FaUser, 
  FaUsers, 
  FaFileAlt, 
  FaShieldAlt, 
  FaChalkboardTeacher, 
  FaClipboardCheck, 
  FaDesktop, 
  FaUserLock, 
  FaExchangeAlt 
} from 'react-icons/fa';

const policiesData = [
  // ... (نفس البيانات السابقة دون تغيير)
  {
    icon: FaUser,
    title: "User Responsibilities",
    rules: [
      "Students must provide accurate and complete information.",
      "Each user is responsible for maintaining the confidentiality of their account.",
      "Any misuse of the platform may result in restricted access."
    ]
  },
  {
    icon: FaUsers,
    title: "Team Formation Rules",
    rules: [
      "Each team must follow the minimum and maximum number of members defined.",
      "Students are responsible for sending and accepting team requests appropriately.",
      "Once a team is finalized, changes may require supervisor approval."
    ]
  },
  {
    icon: FaFileAlt,
    title: "Project Submission Guidelines",
    rules: [
      "All required files must be submitted before the specified deadlines.",
      "Late submissions may be subject to penalties based on course regulations.",
      "Submitted work must be original and comply with academic integrity policies."
    ]
  },
  {
    icon: FaShieldAlt,
    title: "Academic Integrity",
    rules: [
      "Plagiarism, copying, or submitting work that is not your own is strictly prohibited.",
      "Any violation may lead to academic penalties as per university rules."
    ]
  },
  {
    icon: FaChalkboardTeacher,
    title: "Final Discussion Policy",
    rules: [
      "Each team will be assigned a discussion committee consisting of three professors and one teaching assistant.",
      "The schedule (date, time, and location) will be announced through the platform.",
      "Attendance is mandatory for all team members."
    ]
  },
  {
    icon: FaClipboardCheck,
    title: "Evaluation & Feedback",
    rules: [
      "Project evaluation is divided into coursework and final discussion.",
      "Coursework grades are assigned by the supervisor.",
      "Final discussion grades are determined by the assigned committee.",
      "Feedback provided by supervisors is part of the evaluation process."
    ]
  },
  {
    icon: FaDesktop,
    title: "System Usage Rules",
    rules: [
      "Users must not attempt to misuse, hack, or disrupt the platform.",
      "Any suspicious activity may result in account suspension."
    ]
  },
  {
    icon: FaUserLock,
    title: "Privacy & Data Usage",
    rules: [
      "User data is used solely for academic and administrative purposes.",
      "The platform does not share personal data with external parties."
    ]
  },
  {
    icon: FaExchangeAlt,
    title: "Changes to Policies",
    rules: [
      "The platform administration reserves the right to update these policies when necessary.",
      "Users will be notified of any significant changes."
    ]
  }
];

export default function GraduationProjectPolicies() {
  return (
    // استخدام flex لجعل السايد بار بجانب المحتوى
    <div className="flex min-h-screen bg-[#EAEAEA] font-sans antialiased text-[#1F2937]">
      


      
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
       <h1 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
  Terms & Policies
</h1>
        <div className="max-w-[1200px] mx-auto space-y-6">
          
          {/* 1. قسم المقدمة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 text-xl">
                <FaBookOpen />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Introduction</h1>
            </div>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
              <p>
                This platform is designed to support students, teaching assistants, and academic staff in managing graduation projects, team collaboration, and evaluation processes.
              </p>
              <p>
                By using this system, you agree to follow all academic and platform-related rules stated below.
              </p>
            </div>
          </div>

          {/* 2. شبكة البطاقات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {policiesData.map((policy, index) => {
              const IconComponent = policy.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 text-lg">
                      <IconComponent />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{policy.title}</h2>
                  </div>
                  
                  <div className="w-full h-px bg-gray-100 mb-5"></div>
                  
                  <ul className="list-disc list-outside pl-5 space-y-2.5 text-gray-700 text-[14.5px] leading-relaxed flex-grow">
                    {policy.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="pl-1">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}