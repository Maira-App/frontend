import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PlanCard({ plan, isCurrentPlan, onSelectPlan, isLoading }) {
  const savings = plan.type === 'yearly' ? Math.round(((199 * 12) - plan.price) / (199 * 12) * 100) : 0;

  return (
    <div className={`relative bg-gray-900/50 rounded-2xl p-6 border transition-all duration-200 ${
      plan.popular 
        ? 'border-cyan-500 ring-2 ring-cyan-500/20' 
        : isCurrentPlan 
          ? 'border-green-500 ring-2 ring-green-500/20'
          : 'border-gray-700 hover:border-gray-600'
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-4 right-6">
          <Badge className="bg-green-600 text-white px-3 py-1">
            Current Plan
          </Badge>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold text-white">${plan.price}</span>
          <span className="text-gray-400">/{plan.billing}</span>
        </div>
        {savings > 0 && (
          <p className="text-green-400 text-sm mt-2 font-medium">
            Save {savings}% compared to monthly
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelectPlan(plan)}
        disabled={isCurrentPlan || isLoading}
        className={`w-full ${
          plan.popular
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
            : isCurrentPlan
              ? 'bg-green-600 cursor-not-allowed'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
        }`}
      >
        {isCurrentPlan ? 'Current Plan' : isLoading ? 'Processing...' : `Choose ${plan.name}`}
      </Button>
    </div>
  );
}