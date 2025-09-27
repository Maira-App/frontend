import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Download, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingHistory() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock billing history for demonstration
    const mockInvoices = [
      {
        id: 'inv_1',
        date: '2024-12-01',
        amount: 19900,
        status: 'paid',
        description: 'MAIRA Monthly Subscription',
        invoice_url: '#'
      },
      {
        id: 'inv_2',
        date: '2024-11-01',
        amount: 19900,
        status: 'paid',
        description: 'MAIRA Monthly Subscription',
        invoice_url: '#'
      },
      {
        id: 'inv_3',
        date: '2024-10-01',
        amount: 19900,
        status: 'paid',
        description: 'MAIRA Monthly Subscription',
        invoice_url: '#'
      }
    ];
    
    setInvoices(mockInvoices);
    setIsLoading(false);
  }, []);

  const formatAmount = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Receipt className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Billing History</h3>
          <p className="text-sm text-gray-400">Download invoices and view payment history</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No billing history available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <Receipt className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{invoice.description}</p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(invoice.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-white">{formatAmount(invoice.amount)}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusBadge(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(invoice.invoice_url, '_blank')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}