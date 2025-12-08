'use client';

import React from 'react';

interface FormStepperProps {
  steps: string[];
  currentStep: number;
}

export function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-sabay-primary' : 'bg-white/10'
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2 text-sm">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 ${index < currentStep ? 'bg-sabay-primary' : 'bg-white/10'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
