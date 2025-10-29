import { useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { validatePasswordResetForm } from "@/utils/validation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    
    // Limit password fields to 10 characters
    if (field === 'newPassword' || field === 'confirmPassword') {
      value = value.slice(0, 10);
    }
    
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form using shared validation
    const validation = validatePasswordResetForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await api.put('/api/auth/reset-password', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Password updated successfully");
      
      // Clear form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to update password";
      toast.error(errorMessage);
      
      // Display field-specific errors if available
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-purple-5">Reset Password</h1>

      <div className="bg-light-1 rounded-xl shadow-sm border-2 border-purple-3 p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          <div>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={handleChange('currentPassword')}
              label="Current password"
              required
              size="lg"
              error={errors.currentPassword}
              placeholder="••••••••"
            />
          </div>

          <div>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={handleChange('newPassword')}
              label="New password"
              required
              size="lg"
              error={errors.newPassword}
              placeholder="••••••••"
              maxLength={10}
              helperText="Maximum 10 characters"
            />
          </div>

          <div>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              label="Confirm new password"
              required
              size="lg"
              error={errors.confirmPassword}
              placeholder="••••••••"
              maxLength={10}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}