import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import api from '@/utils/api';
import Swal from 'sweetalert2';
import { CheckCircle2, FileText, X, Users, BookOpen } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery: any;
  onSuccess?: () => void;
}

export default function SubmitTrainingReportModal({ open, onOpenChange, delivery, onSuccess }: Props) {
  const [reportText, setReportText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setReportText('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      Swal.fire({
          icon: 'warning',
          title: 'Notes Required',
          text: 'Please provide session highlights or completion notes before finalizing.',
          confirmButtonColor: '#065f46'
      });
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/training-deliveries/${delivery._id}`, {
        status: 'completed',
        completionNotes: reportText
      });

      onOpenChange(false);
      await Swal.fire({
        icon: 'success',
        title: 'Report Submitted',
        text: 'The training session has been marked as completed.',
        confirmButtonColor: '#065f46',
        timer: 3000,
        timerProgressBar: true
      });
      onSuccess?.();
    } catch (error: any) {
      Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: error.response?.data?.message || 'We could not sync the training report at this time.',
          confirmButtonColor: '#065f46'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border-none rounded-2xl overflow-hidden shadow-2xl [&>button:first-of-type]:hidden bg-white">
        {/* Header */}
        <div className="bg-[#065f46] p-5 flex items-start justify-between text-white">
          <div className="flex gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-none mb-1">Submit Training Report</h2>
              <p className="text-xs text-white/70 font-semibold">{delivery.moduleTitle}</p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Info Box */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              {delivery.farmers?.length || 0} Target Farmers
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              {delivery.mode}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
            Session Report / Completion Notes *
          </label>
          <Textarea 
            placeholder="Summarise how the training went. Did everyone attend? Were there any challenges or key questions from the farmers?"
            className="min-h-[140px] resize-none rounded-xl border border-gray-200 bg-white text-sm focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] placeholder:text-gray-400"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <Button 
            disabled={saving || !reportText.trim()}
            onClick={handleSubmit}
            className="h-9 px-6 bg-[#065f46] hover:bg-[#065f46]/90 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow border-none gap-2"
          >
            {saving ? 'Loading...' : <><CheckCircle2 className="h-3.5 w-3.5" /> Submit & Complete</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
