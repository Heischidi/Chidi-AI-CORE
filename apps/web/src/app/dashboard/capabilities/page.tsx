'use client';
import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import CapabilityCard from '@/components/dashboard/CapabilityCard';

export default function Capabilities() {
  const [caps, setCaps] = useState({
    answer: true,
    search: true,
    recommend: true,
    negotiate: false,
    leads: true,
    appointments: false,
    tracking: true,
    handoff: true,
    voice: false
  });

  const toggle = (key: keyof typeof caps) => {
    setCaps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <PageHeader 
        title="What should Chidi be able to do?" 
        description="Configure the actions and capabilities Chidi is authorized to perform on your behalf." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CapabilityCard 
          title="Answer questions" 
          description="Chidi can answer questions using the business knowledge base you provide." 
          enabled={caps.answer} 
          status={caps.answer ? "Active" : "Disabled"}
          onToggle={() => toggle('answer')} 
        />
        <CapabilityCard 
          title="Product search" 
          description="Chidi can search your products and provide links and details to customers." 
          enabled={caps.search} 
          status={caps.search ? "Active" : "Disabled"}
          onToggle={() => toggle('search')} 
        />
        <CapabilityCard 
          title="Price negotiation" 
          description="Chidi can negotiate prices according to configured business rules." 
          enabled={caps.negotiate} 
          status={caps.negotiate ? "Active" : "Disabled"}
          onToggle={() => toggle('negotiate')} 
        />
        <CapabilityCard 
          title="Lead capture" 
          description="Chidi can collect customer contact information for follow-up." 
          enabled={caps.leads} 
          status={caps.leads ? "Active" : "Disabled"}
          onToggle={() => toggle('leads')} 
        />
        <CapabilityCard 
          title="Appointment booking" 
          description="Chidi can schedule appointments on your calendar." 
          enabled={caps.appointments} 
          status={caps.appointments ? "Active" : "Disabled"}
          onToggle={() => toggle('appointments')} 
        />
        <CapabilityCard 
          title="Order tracking" 
          description="Chidi can help customers track their order status." 
          enabled={caps.tracking} 
          status={caps.tracking ? "Active" : "Disabled"}
          onToggle={() => toggle('tracking')} 
        />
        <CapabilityCard 
          title="Human handoff" 
          description="Chidi can transfer conversations to a human agent when requested." 
          enabled={caps.handoff} 
          status={caps.handoff ? "Active" : "Disabled"}
          onToggle={() => toggle('handoff')} 
        />
        <CapabilityCard 
          title="Voice interface" 
          description="Chidi can communicate through spoken voice." 
          enabled={caps.voice} 
          status={caps.voice ? "Active" : "Disabled"}
          onToggle={() => toggle('voice')} 
        />
      </div>
    </div>
  );
}