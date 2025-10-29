/**
 * Export Button Component
 * Provides export functionality for statistics data
 */

import { useState } from 'react';
import { Download, FileText, Table, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { exportToExcel, exportToPDF, emailReport } from '@/services/exportService';
import Button from '../ui/Button';

const ExportButton = ({ data, filename = 'statistics' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [lastExportTime, setLastExportTime] = useState(0);

  const handleExport = async (type) => {
    // Prevent multiple clicks within 2 seconds
    const now = Date.now();
    if (now - lastExportTime < 2000) {
      return;
    }

    if (!data || (!data.platform && !data.users && !data.posts && !data.engagement)) {
      toast.error('No data available to export');
      return;
    }

    if (isExporting) {
      return;
    }

    setIsExporting(true);
    setLastExportTime(now);
    
    try {
      let result;
      
      switch (type) {
        case 'excel':
          result = exportToExcel(data, filename);
          break;
        case 'pdf':
          result = exportToPDF(data, filename);
          break;
        case 'email':
          if (!email) {
            setShowEmailModal(true);
            setIsExporting(false);
            return;
          }
          result = await emailReport(data, email);
          break;
        default:
          throw new Error('Invalid export type');
      }

      if (result.success) {
        toast.success(result.message);
        if (type === 'email') {
          setShowEmailModal(false);
          setEmail('');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    await handleExport('email');
  };

  return (
    <>
      <div className="relative group">
      <Button
        onClick={() => handleExport('excel')}
        disabled={isExporting}
        loading={isExporting}
        icon={<Table />}
        variant="primary"
      >
        Export Excel
      </Button>
      </div>

      <div className="relative group">
        <Button
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          loading={isExporting}
          icon={<FileText />}
          variant="danger"
        >
          Export PDF
        </Button>
      </div>

      <div className="relative group">
        <Button
          onClick={() => handleExport('email')}
          disabled={isExporting}
          loading={isExporting}
          icon={<Mail />}
          variant="success"
        >
          Email Report
        </Button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-bold text-dark-1 mb-4">Email Report</h3>
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-7 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-5 focus:border-transparent"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmail('');
                    setIsExporting(false);
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isExporting}
                  loading={isExporting}
                  variant="primary"
                >
                  {isExporting ? 'Sending...' : 'Send Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportButton;
