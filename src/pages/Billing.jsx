import React, { useState, useEffect } from 'react';
import { CreditCard, Gift, Receipt, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Subscription, User } from '@/entities/all';

import PlanCard from '../components/billing/PlanCard';
import ReferralSection from '../components/billing/ReferralSection';
import BillingHistory from '../components/billing/BillingHistory';

export default function Billing() {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      type: 'monthly',
      price: 199,
      billing: 'month',
      popular: false,
      features: [
        'Unlimited voice interactions',
        'Real-time calendar management',
        'Client relationship management',
        'Property listing assistance',
        'Market insights & analytics',
        'Email & SMS follow-ups',
        '24/7 availability',
        'Integration with major CRMs'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly',
      type: 'yearly',
      price: 2200,
      billing: 'year',
      popular: true,
      features: [
        'Everything in Monthly plan',
        'Priority customer support',
        'Advanced analytics dashboard',
        'Custom integrations',
        'Dedicated account manager',
        'Early access to new features',
        'Save $188 per year',
        'Free setup & onboarding'
      ]
    }
  ];

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const subscriptions = await Subscription.filter({ created_by: user.email });
      
      if (subscriptions.length > 0) {
        setSubscription(subscriptions[0]);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
    setIsLoading(false);
  };

  const handleSelectPlan = async (plan) => {
    setError('');
    
    try {
      // In a real implementation, this would integrate with Stripe
      // For now, we'll create a mock subscription
      const user = await User.me();
      
      const subscriptionData = {
        plan_type: plan.type,
        status: 'active',
        amount: plan.price * 100, // Convert to cents
        currency: 'usd',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + (plan.type === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)).toISOString(),
        next_billing_date: new Date(Date.now() + (plan.type === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)).toISOString(),
        referral_code_used: referralCode || null
      };

      if (subscription) {
        await Subscription.update(subscription.id, subscriptionData);
      } else {
        await Subscription.create(subscriptionData);
      }
      
      await loadSubscription();
      setShowReferralInput(false);
      setReferralCode('');
      
      // Show success message
      alert(`Successfully subscribed to ${plan.name} plan!`);
      
    } catch (error) {
      console.error('Error subscribing:', error);
      setError('There was an error processing your subscription. Please try again.');
    }
  };

  const formatNextBilling = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Billing & Subscription</h1>
          <p className="text-gray-400 mt-2">Manage your MAIRA subscription and billing</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Current Subscription Status */}
        {subscription && (
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {subscription.plan_type === 'yearly' ? 'Yearly' : 'Monthly'} Plan Active
                  </h3>
                  <p className="text-gray-400">
                    Next billing: {formatNextBilling(subscription.next_billing_date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ${(subscription.amount / 100).toFixed(0)}
                </p>
                <p className="text-gray-400">
                  /{subscription.plan_type === 'yearly' ? 'year' : 'month'}
                </p>
              </div>
            </div>
            
            {subscription.free_months_remaining > 0 && (
              <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <p className="text-purple-400 text-sm">
                  🎉 You have {subscription.free_months_remaining} free month{subscription.free_months_remaining > 1 ? 's' : ''} remaining from referrals!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Plans */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Choose Your MAIRA Plan</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Transform your real estate business with AI-powered assistance. Available 24/7 to handle calls, 
              manage schedules, and nurture client relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={subscription?.plan_type === plan.type}
                onSelectPlan={(selectedPlan) => {
                  if (!subscription) {
                    setShowReferralInput(true);
                  }
                  handleSelectPlan(selectedPlan);
                }}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* Referral Code Input */}
          {showReferralInput && (
            <div className="max-w-md mx-auto mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-400 text-sm mb-2">Have a referral code?</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  onClick={() => setShowReferralInput(false)}
                  variant="outline"
                  className="border-gray-600"
                >
                  Skip
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Referral Program */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ReferralSection />
          <BillingHistory />
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-2">30-Day Money-Back Guarantee</h3>
            <p className="text-gray-300">
              Try MAIRA risk-free for 30 days. If you're not completely satisfied with how MAIRA transforms 
              your real estate business, we'll refund your money, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}