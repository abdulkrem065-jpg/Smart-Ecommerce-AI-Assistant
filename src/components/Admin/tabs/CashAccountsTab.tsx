import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Building2, Plus, ArrowDownCircle, ArrowUpCircle, Users, ArrowLeftRight, Wallet, X } from 'lucide-react';
import { CashAccount, ReceiptVoucher, PaymentVoucher, Custody, CashTransfer } from '../../../core/types';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';
import { LoadingSpinner } from '../../LoadingSpinner';
import { t } from '../../../core/translations';
import { formatDate, formatCurrency } from '../../../core/utils';

export function CashAccountsTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { cashAccounts, receiptVouchers, paymentVouchers, custodies, cashTransfers, addCashAccount, createReceiptVoucher, createPaymentVoucher, createCustody } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'receipts' | 'payments' | 'custodies' | 'transfers'>('accounts');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<'صندوق' | 'بنك'>('صندوق');
  const [newAccBalance, setNewAccBalance] = useState('');
  
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCustodyModal, setShowCustodyModal] = useState(false);
  
  const [rvData, setRvData] = useState({ amount: '', fromParty: '', description: '', cashAccountId: '' });
  const [pvData, setPvData] = useState({ amount: '', toParty: '', description: '', cashAccountId: '' });
  const [custodyData, setCustodyData] = useState({ employeeName: '', amount: '', description: '' });

  const handleSaveReceipt = () => {
    if (!rvData.amount || !rvData.cashAccountId) return;
    const acc = cashAccounts.find((a: any) => a.id === rvData.cashAccountId);
    if (!acc) return;
    if (createReceiptVoucher) {
      createReceiptVoucher({
        amount: parseFloat(rvData.amount),
        fromParty: rvData.fromParty,
        description: rvData.description,
        cashAccountId: rvData.cashAccountId,
        cashAccountName: acc.name,
      });
    }
    setShowReceiptModal(false);
    setRvData({ amount: '', fromParty: '', description: '', cashAccountId: '' });
  };

  const handleSavePayment = () => {
    if (!pvData.amount || !pvData.cashAccountId) return;
    const acc = cashAccounts.find((a: any) => a.id === pvData.cashAccountId);
    if (!acc) return;
    if (createPaymentVoucher) {
      createPaymentVoucher({
        amount: parseFloat(pvData.amount),
        toParty: pvData.toParty,
        description: pvData.description,
        cashAccountId: pvData.cashAccountId,
        cashAccountName: acc.name,
      });
    }
    setShowPaymentModal(false);
    setPvData({ amount: '', toParty: '', description: '', cashAccountId: '' });
  };

  const handleSaveCustody = () => {
    if (!custodyData.amount || !custodyData.employeeName) return;
    if (createCustody) {
      createCustody({
        employeeName: custodyData.employeeName,
        amount: parseFloat(custodyData.amount),
        purpose: custodyData.description,
        // status omitted
      });
    }
    setShowCustodyModal(false);
    setCustodyData({ employeeName: '', amount: '', description: '' });
  };


  const handleAddAccount = () => {
    if (!newAccName.trim()) return;
    addCashAccount({
      name: newAccName,
      type: newAccType,
      currency: 'SAR'
    }, parseFloat(newAccBalance) || 0);
    setShowAddAccount(false);
    setNewAccName('');
    setNewAccBalance('');
  };

  const tabs = [
    { id: 'accounts', label: t('accounts', lang), icon: Wallet },
    { id: 'receipts', label: t('receipts', lang), icon: ArrowDownCircle },
    { id: 'payments', label: t('payments', lang), icon: ArrowUpCircle },
    { id: 'custodies', label: t('custodies', lang), icon: Users },
    { id: 'transfers', label: t('transfers', lang), icon: ArrowLeftRight },
  ] as const;

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      {/* Header and Sub-tabs */}
      <div className="bg-[#0b1329] p-4 rounded-xl shadow-lg border border-blue-900/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            {t('cashAccounts.title', lang)}
          </h2>
          <div className="flex bg-[#060b18] p-1 rounded-lg border border-blue-900/40 overflow-x-auto w-full md:w-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                    activeSubTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-[#0f172a]/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accounts Content */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">{t('cashAndBankAccounts', lang)}</h3>
            <button 
              onClick={() => setShowAddAccount(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              {t('addAccount', lang)}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cashAccounts.map((acc: CashAccount) => (
              <div key={acc.id} className="bg-[#0b1329] p-5 rounded-xl border border-blue-900/40 shadow-lg relative overflow-hidden group">
                <div className={`absolute top-0 ${lang === 'en' ? 'right-0 rounded-bl-xl' : 'left-0 rounded-br-xl'} px-3 py-1 text-xs font-bold ${
                  acc.type === 'بنك' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {lang === 'en' && acc.type === 'بنك' ? 'Bank' : lang === 'en' && acc.type === 'صندوق' ? 'Cash' : acc.type}
                </div>
                <h4 className="text-lg font-bold text-white mb-2 pr-8">{acc.name}</h4>
                <div className="text-2xl font-black text-blue-400">
                  {formatCurrency(acc.balance, acc.currency, lang)}
                </div>
              </div>
            ))}
            {cashAccounts.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-500 bg-[#0b1329] rounded-xl border border-blue-900/40">
                {t('noAccountsAdded', lang)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipts Content */}
      {activeSubTab === 'receipts' && (
        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
          <div className="p-4 border-b border-blue-900/40 flex justify-end">
            <button onClick={() => setShowReceiptModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors text-sm">
              <Plus className="w-4 h-4" /> {lang === 'en' ? 'Add Receipt' : 'سند قبض جديد'}
            </button>
          </div>
          <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 font-bold text-slate-400">{t('date', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('description', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('fromParty', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('depositedTo', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('amount', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {receiptVouchers.map((rv: ReceiptVoucher) => (
                <tr key={rv.id} className="hover:bg-[#0f172a]/5">
                  <td className="p-4 text-sm text-slate-300">{formatDate(rv.date, lang)}</td>
                  <td className="p-4 text-sm text-white">{rv.description}</td>
                  <td className="p-4 text-sm text-slate-300">{rv.fromParty}</td>
                  <td className="p-4 text-sm text-slate-300">{rv.cashAccountName}</td>
                  <td className="p-4 text-sm font-bold text-emerald-400">{formatCurrency(rv.amount, "SAR", lang)}</td>
                </tr>
              ))}
              {!receiptVouchers ? (<tr><td colSpan={5} className="p-8"><LoadingSpinner /></td></tr>) : receiptVouchers.length === 0 && (<tr><td colSpan={5} className="p-8"><EmptyState title={t('noData', lang)} /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {/* Payments Content */}
      {activeSubTab === 'payments' && (
        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
          <div className="p-4 border-b border-blue-900/40 flex justify-end">
            <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors text-sm">
              <Plus className="w-4 h-4" /> {lang === 'en' ? 'Add Payment' : 'سند صرف جديد'}
            </button>
          </div>
          <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 font-bold text-slate-400">{t('date', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('description', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('paidTo', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('paidFrom', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('amount', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {paymentVouchers.map((pv: PaymentVoucher) => (
                <tr key={pv.id} className="hover:bg-[#0f172a]/5">
                  <td className="p-4 text-sm text-slate-300">{formatDate(pv.date, lang)}</td>
                  <td className="p-4 text-sm text-white">{pv.description}</td>
                  <td className="p-4 text-sm text-slate-300">{pv.toParty}</td>
                  <td className="p-4 text-sm text-slate-300">{pv.cashAccountName}</td>
                  <td className="p-4 text-sm font-bold text-red-400">{formatCurrency(pv.amount, "SAR", lang)}</td>
                </tr>
              ))}
              {!paymentVouchers ? (<tr><td colSpan={5} className="p-8"><LoadingSpinner /></td></tr>) : paymentVouchers.length === 0 && (<tr><td colSpan={5} className="p-8"><EmptyState title={t('noData', lang)} /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {/* Custodies Content */}
      {activeSubTab === 'custodies' && (
        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
          <div className="p-4 border-b border-blue-900/40 flex justify-end">
            <button onClick={() => setShowCustodyModal(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors text-sm">
              <Plus className="w-4 h-4" /> {lang === 'en' ? 'Add Custody' : 'عهدة جديدة'}
            </button>
          </div>
          <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 font-bold text-slate-400">{t('date', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('employee', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('purpose', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('amount', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('status', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {custodies.map((c: Custody) => (
                <tr key={c.id} className="hover:bg-[#0f172a]/5">
                  <td className="p-4 text-sm text-slate-300">{formatDate(c.date, lang)}</td>
                  <td className="p-4 text-sm text-white">{c.employeeName}</td>
                  <td className="p-4 text-sm text-slate-300">{c.purpose}</td>
                  <td className="p-4 text-sm font-bold text-amber-400">{formatCurrency(c.amount, "SAR", lang)}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      c.status === 'مسددة' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {lang === 'en' && c.status === 'مسددة' ? 'Settled' : 
                       lang === 'en' && c.status === 'مفتوحة' ? 'Open' : c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!custodies ? (<tr><td colSpan={5} className="p-8"><LoadingSpinner /></td></tr>) : custodies.length === 0 && (<tr><td colSpan={5} className="p-8"><EmptyState title={t('noData', lang)} /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {/* Transfers Content */}
      {activeSubTab === 'transfers' && (
        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
          <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 font-bold text-slate-400">{t('date', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('description', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('fromAccount', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('toAccount', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('amount', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {cashTransfers.map((t: CashTransfer) => (
                <tr key={t.id} className="hover:bg-[#0f172a]/5">
                  <td className="p-4 text-sm text-slate-300">{formatDate(t.date, lang)}</td>
                  <td className="p-4 text-sm text-white">{t.description}</td>
                  <td className="p-4 text-sm text-slate-300">{t.fromAccountName}</td>
                  <td className="p-4 text-sm text-slate-300">{t.toAccountName}</td>
                  <td className="p-4 text-sm font-bold text-purple-400">{formatCurrency(t.amount, "SAR", lang)}</td>
                </tr>
              ))}
              {!cashTransfers ? (<tr><td colSpan={5} className="p-8"><LoadingSpinner /></td></tr>) : cashTransfers.length === 0 && (<tr><td colSpan={5} className="p-8"><EmptyState title={t('noData', lang)} /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{t('addNewAccount', lang)}</h3>
              <button onClick={() => setShowAddAccount(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('accountName', lang)}</label>
                <input 
                  type="text" 
                  value={newAccName} 
                  onChange={e => setNewAccName(e.target.value)} 
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-blue-500" 
                  placeholder={t('accountNamePlaceholder', lang)} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('type', lang)}</label>
                <select 
                  value={newAccType} 
                  onChange={e => setNewAccType(e.target.value as 'صندوق' | 'بنك')} 
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="صندوق">{t('cashBox', lang)}</option>
                  <option value="بنك">{t('bankAccount', lang)}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('openingBalance', lang)}</label>
                <input 
                  type="number" 
                  value={newAccBalance} 
                  onChange={e => setNewAccBalance(e.target.value)} 
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-blue-500" 
                  placeholder="0" 
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={handleAddAccount} 
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  {t('save', lang)}
                </button>
                <button 
                  onClick={() => setShowAddAccount(false)} 
                  className="flex-1 bg-[#0f172a]/5 text-white py-3 rounded-lg font-bold hover:bg-[#0f172a]/10 transition-colors"
                >
                  {t('cancel', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#060b18]">
              <h3 className="text-lg font-black text-white">{lang === 'en' ? 'Add Receipt Voucher' : 'سند قبض جديد'}</h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('amount', lang)}</label>
                <input type="number" value={rvData.amount} onChange={e => setRvData({...rvData, amount: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{lang === 'en' ? 'Received From' : 'مستلم من'}</label>
                <input type="text" value={rvData.fromParty} onChange={e => setRvData({...rvData, fromParty: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('account', lang)}</label>
                <select value={rvData.cashAccountId} onChange={e => setRvData({...rvData, cashAccountId: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white">
                  <option value="">{lang === 'en' ? 'Select Account' : 'اختر الحساب'}</option>
                  {cashAccounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('notes', lang)}</label>
                <input type="text" value={rvData.description} onChange={e => setRvData({...rvData, description: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSaveReceipt} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold">{t('save', lang)}</button>
                <button onClick={() => setShowReceiptModal(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold">{t('cancel', lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#060b18]">
              <h3 className="text-lg font-black text-white">{lang === 'en' ? 'Add Payment Voucher' : 'سند صرف جديد'}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('amount', lang)}</label>
                <input type="number" value={pvData.amount} onChange={e => setPvData({...pvData, amount: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{lang === 'en' ? 'Paid To' : 'يصرف إلى'}</label>
                <input type="text" value={pvData.toParty} onChange={e => setPvData({...pvData, toParty: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('account', lang)}</label>
                <select value={pvData.cashAccountId} onChange={e => setPvData({...pvData, cashAccountId: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white">
                  <option value="">{lang === 'en' ? 'Select Account' : 'اختر الحساب'}</option>
                  {cashAccounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('notes', lang)}</label>
                <input type="text" value={pvData.description} onChange={e => setPvData({...pvData, description: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSavePayment} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">{t('save', lang)}</button>
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold">{t('cancel', lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCustodyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#060b18]">
              <h3 className="text-lg font-black text-white">{lang === 'en' ? 'Add Custody' : 'إضافة عهدة'}</h3>
              <button onClick={() => setShowCustodyModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('amount', lang)}</label>
                <input type="number" value={custodyData.amount} onChange={e => setCustodyData({...custodyData, amount: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('employee', lang)}</label>
                <input type="text" value={custodyData.employeeName} onChange={e => setCustodyData({...custodyData, employeeName: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('purpose', lang)}</label>
                <input type="text" value={custodyData.description} onChange={e => setCustodyData({...custodyData, description: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSaveCustody} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold">{t('save', lang)}</button>
                <button onClick={() => setShowCustodyModal(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold">{t('cancel', lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
