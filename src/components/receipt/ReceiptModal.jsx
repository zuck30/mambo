import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { pdf } from '@react-pdf/renderer';
import { 
  Printer, 
  Share2, 
  X, 
  Copy,
  User,
  Car as CarIcon,
  Calendar,
  MessageCircle,
  Download,
  Loader2,
  FileText,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import logo from '../../assets/garidesk.png';
import PDFReceiptDocument from './PDFReceiptDocument';
import { usePayments } from '../../hooks/usePayments';
import ConfirmDialog from '../ui/ConfirmDialog';

const ReceiptModal = ({ isOpen, onClose, payment, job }) => {
  const componentRef = useRef();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showReverseConfirm, setShowReverseConfirm] = useState(false);
  const [reversalReason, setReversalReason] = useState('');
  const { reversePayment } = usePayments();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Receipt-${payment?.receipt_number}`,
    onAfterPrint: () => toast.success('Receipt printed')
  });

  const handleDownloadPDF = async () => {
    try {
      setIsPdfGenerating(true);
      
      if (!payment || !job) {
        toast.error('Missing receipt data');
        return;
      }
      
      const blob = await pdf(<PDFReceiptDocument payment={payment} job={job} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt-${payment?.receipt_number || 'download'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handlePrintPDF = async () => {
    try {
      setIsPdfGenerating(true);
      
      if (!payment || !job) {
        toast.error('Missing receipt data');
        return;
      }
      
      const blob = await pdf(<PDFReceiptDocument payment={payment} job={job} />).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        toast.error('Please allow popups to print');
      }
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF print error:', error);
      toast.error(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleSMSShare = () => {
    const phone = job?.customers?.phone || '';
    const text = `GariDesk Receipt #${payment?.receipt_number}\n` +
      `Amount: ${formatCurrency(payment?.amount_paid)}\n` +
      `Date: ${formatDate(new Date(), 'dd MMM yyyy')}\n` +
      `Vehicle: ${job?.cars?.plate_number}\n` +
      `Thank you for your business!`;
    
    window.open(`sms:${phone}?body=${encodeURIComponent(text)}`);
    toast.success('Opening messages...');
  };

  const handleWhatsAppShare = () => {
    const phone = job?.customers?.phone || '';
    const text = `*GariDesk RECEIPT*\n\n` +
      `Receipt #: ${payment?.receipt_number}\n` +
      `Date: ${formatDate(new Date(), 'dd MMM yyyy, HH:mm')}\n\n` +
      `Customer: ${job?.customers?.full_name}\n` +
      `Vehicle: ${job?.cars?.plate_number} (${job?.cars?.make} ${job?.cars?.model})\n\n` +
      `Services:\n${job?.job_services?.map(s => `• ${s.services?.name}: ${formatCurrency(s.subtotal)}`).join('\n')}\n\n` +
      `Total Paid: ${formatCurrency(payment?.amount_paid)}\n` +
      `Method: ${payment?.payment_method?.replace('_', ' ').toUpperCase()}\n\n` +
      `Thank you for choosing GariDesk!`;
    
    window.open(`https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`);
    toast.success('Opening WhatsApp...');
  };

  const handleCopyReceipt = () => {
    const text = `GariDesk RECEIPT\n` +
      `Receipt #${payment?.receipt_number}\n` +
      `Amount: ${formatCurrency(payment?.amount_paid)}\n` +
      `Date: ${formatDate(new Date())}\n` +
      `Customer: ${job?.customers?.full_name}\n` +
      `Vehicle: ${job?.cars?.plate_number}\n` +
      `Payment Method: ${payment?.payment_method?.replace('_', ' ').toUpperCase()}`;
    
    navigator.clipboard?.writeText(text);
    toast.success('Receipt copied to clipboard!');
  };

  const handleReverse = async () => {
    if (!reversalReason.trim()) {
      toast.error('Please provide a reason for reversal');
      return;
    }
    
    try {
      await reversePayment.mutateAsync({
        paymentId: payment.id,
        reason: reversalReason
      });
      setShowReverseConfirm(false);
      setReversalReason('');
      onClose();
    } catch (error) {
      console.error('Reversal failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ border: '8px solid #d34932' }}
          >
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="GariDesk" className="h-10 w-10 object-cover rounded-lg" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Payment Complete</h3>
                    <p className="text-[10px] text-slate-500 font-bold">Transaction Successful</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <div className="h-1 w-16 bg-[#d34932] rounded-full mb-6" />
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <h2 className="text-3xl font-black text-slate-900 mb-1">
                  {formatCurrency(payment?.amount_paid)}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-orange-50 text-[#d34932] text-[9px] font-black uppercase tracking-widest rounded-full">
                    {payment?.payment_method?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold">
                  Receipt #{payment?.receipt_number}
                </p>
              </div>

              {payment?.payment_status === 'refunded' && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                  <AlertTriangle size={20} className="text-red-600" />
                  <div>
                    <p className="text-sm font-black text-red-700 uppercase">Payment Reversed</p>
                    <p className="text-xs text-red-600">{payment.notes}</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User size={16} className="text-slate-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                      <p className="text-sm font-black text-slate-900">{job?.customers?.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CarIcon size={16} className="text-slate-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vehicle</p>
                      <p className="text-sm font-black text-slate-900">{job?.cars?.plate_number}</p>
                      <p className="text-[10px] text-slate-500">{job?.cars?.make} {job?.cars?.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-slate-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date & Time</p>
                      <p className="text-sm font-black text-slate-900">{formatDate(new Date(), 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden">
                <div ref={componentRef} style={{ padding: '60px', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <img src={logo} alt="GariDesk" style={{ height: '50px' }} />
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Official Receipt</p>
                    </div>
                  </div>

                  <div style={{ height: '4px', width: '60px', backgroundColor: '#d34932', borderRadius: '2px', marginBottom: '32px' }} />

                  <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>Receipt</h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>#{payment?.receipt_number}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Customer</p>
                      <p style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>{job?.customers?.full_name}</p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{job?.customers?.phone}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Vehicle</p>
                      <p style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>{job?.cars?.plate_number}</p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{job?.cars?.make} {job?.cars?.model}</p>
                    </div>
                  </div>

                  <table style={{ width: '100%', marginBottom: '32px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Service</th>
                        <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {job?.job_services?.map((s, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: '600', color: '#334155' }}>{s.services?.name}</td>
                          <td style={{ textAlign: 'right', padding: '12px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(s.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td style={{ padding: '16px 0 8px', fontSize: '14px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase' }}>Total Paid</td>
                        <td style={{ textAlign: 'right', padding: '16px 0 8px', fontSize: '20px', fontWeight: '900', color: '#d34932' }}>{formatCurrency(payment?.amount_paid)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 0', fontSize: '10px', color: '#94a3b8' }} colSpan="2">
                          Payment Method: {payment?.payment_method?.replace('_', ' ').toUpperCase()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', marginTop: '24px' }}>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Date</p>
                      <p style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', margin: 0 }}>{formatDate(new Date(), 'dd MMM yyyy')}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Time</p>
                      <p style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', margin: 0 }}>{formatDate(new Date(), 'HH:mm')}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Receipt</p>
                      <p style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', margin: 0 }}>#{payment?.receipt_number}</p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', margin: '0 0 4px 0' }}>Thank you for your business!</p>
                    <p style={{ fontSize: '10px', color: '#cbd5e1', margin: 0 }}>📍 Dar es Salaam, Tanzania</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePrintPDF}
                    disabled={isPdfGenerating}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#d34932] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPdfGenerating ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                    {isPdfGenerating ? 'Preparing...' : 'Print Receipt'}
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isPdfGenerating}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPdfGenerating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    {isPdfGenerating ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
                
                {payment?.payment_status !== 'refunded' && (
                  <button
                    onClick={() => setShowReverseConfirm(true)}
                    disabled={reversePayment.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all disabled:opacity-50 border-2 border-red-200"
                  >
                    {reversePayment.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Reverse Payment
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {payment?.id?.slice(0, 8)}</p>
                <div className="flex items-center gap-1">
                  <FileText size={10} className="text-slate-400" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PDF Receipt</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showReverseConfirm}
        onClose={() => {
          setShowReverseConfirm(false);
          setReversalReason('');
        }}
        onConfirm={handleReverse}
        title="Reverse Payment"
        message={
          <div className="space-y-3">
            <p className="text-gray-600">This action cannot be undone. The payment will be marked as refunded and customer balance will be adjusted.</p>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                Reason for reversal
              </label>
              <textarea
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                placeholder="e.g., Duplicate payment, Wrong amount..."
                rows={2}
              />
            </div>
          </div>
        }
        confirmText="Reverse Payment"
        variant="danger"
      />
    </>
  );
};

export default ReceiptModal;