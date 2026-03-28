'use client';

import { CheckCircle, Clock, Circle } from 'lucide-react';

export function ApplicationTimeline({ steps }) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          {/* Icon */}
          <div>
            {step.status === 'completed' && (
              <CheckCircle className="text-green-500" />
            )}

            {step.status === 'current' && (
              <Clock className="text-blue-500 animate-pulse" />
            )}

            {step.status === 'upcoming' && <Circle className="text-gray-300" />}
          </div>

          {/* Content */}
          <div>
            <p className="font-medium">{step.label}</p>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
