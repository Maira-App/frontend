import React, { useState, useEffect } from 'react';
import { Copy, Gift, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Referral, User } from '@/entities/all';

export default function ReferralSection() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const userReferrals = await Referral.filter({ referrer_user_id: user.id });
      
      setReferrals(userReferrals);
      
      // Generate referral code if doesn't exist
      if (userReferrals.length === 0) {
        const newCode = generateReferralCode(user.full_name || user.email);
        setReferralCode(newCode);
      } else {
        setReferralCode(userReferrals[0].referral_code);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    }
    setIsLoading(false);
  };

  const generateReferralCode = (name) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${cleanName}${randomNum}`;
  };

  const createReferralCode = async () => {
    try {
      const user = await User.me();
      const newCode = generateReferralCode(user.full_name || user.email);
      
      await Referral.create({
        referral_code: newCode,
        referrer_user_id: user.id
      });
      
      setReferralCode(newCode);
      loadReferralData();
    } catch (error) {
      console.error('Error creating referral code:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getReferralStats = () => {
    return {
      total: referrals.length,
      qualified: referrals.filter(r => r.status === 'qualified' || r.status === 'completed').length,
      completed: referrals.filter(r => r.status === 'completed').length
    };
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const stats = getReferralStats();

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Gift className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Referral Program</h3>
          <p className="text-sm text-gray-400">Earn free months by referring others</p>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <h4 className="text-sm font-medium text-purple-400 mb-2">How it works:</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Share your referral code with other real estate agents</li>
          <li>• When they sign up and use MAIRA for 2 months, you get 1 free month</li>
          <li>• No limit on referrals - keep earning free months!</li>
        </ul>
      </div>

      {/* Referral Code */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-300 mb-2 block">Your Referral Code</label>
        {referralCode ? (
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={referralCode}
                readOnly
                className="bg-gray-800 border-gray-700 text-white pr-10"
              />
            </div>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        ) : (
          <Button onClick={createReferralCode} className="bg-purple-600 hover:bg-purple-700">
            Generate Referral Code
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
          <div className="text-xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-400">Total Referrals</div>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
          <div className="text-xl font-bold text-green-400">{stats.qualified}</div>
          <div className="text-xs text-gray-400">Qualified</div>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
          <div className="text-xl font-bold text-purple-400">{stats.completed}</div>
          <div className="text-xs text-gray-400">Free Months Earned</div>
        </div>
      </div>

      {/* Share URL */}
      {referralCode && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Share this link:</p>
          <div className="flex gap-2">
            <Input
              value={`https://maira.ai/signup?ref=${referralCode}`}
              readOnly
              className="bg-gray-700 border-gray-600 text-gray-300 text-xs"
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`https://maira.ai/signup?ref=${referralCode}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              size="sm"
              variant="outline"
              className="border-gray-600"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}