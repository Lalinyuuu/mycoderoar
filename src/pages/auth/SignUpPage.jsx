import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { validateRegistrationForm } from "@/utils/validation";
import { useRealTimeValidation } from "@/hooks/useRealTimeValidation";

export default function SignUpPage() {
  useEffect(() => {
    document.title = "Sign up — Ragnarok Guide";
  }, []);

  const navigate = useNavigate();
  const { register } = useAuth();
  const { validateField, getValidationResult, isValidating } = useRealTimeValidation();

  const [values, setValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
    
    // Real-time validation for email and username
    if (e.target.name === 'email' || e.target.name === 'username') {
      validateField(e.target.name, e.target.value);
    }
  };

  const validate = () => {
    const validation = validateRegistrationForm(values);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);

    try {
      await register(values.email, values.password, values.name, values.username, values.confirmPassword);
      setStep("success");
    } catch (error) {
      
      // Determine which field the error belongs to based on the error message
      let errorField = 'email'; // default
      const errorMessage = error.message || "Registration failed. Please try again.";
      
      if (errorMessage.includes('password') || errorMessage.includes('Password')) {
        if (errorMessage.includes('confirm') || errorMessage.includes('match')) {
          errorField = 'confirmPassword';
        } else {
          errorField = 'password';
        }
      } else if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        errorField = 'email';
      } else if (errorMessage.includes('username') || errorMessage.includes('Username')) {
        errorField = 'username';
      } else if (errorMessage.includes('name') || errorMessage.includes('Name')) {
        errorField = 'name';
      }
      
      setErrors({ 
        [errorField]: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-1 via-light-1 to-emerald-1 p-4">
        <div className="max-w-md w-full bg-light-1 rounded-2xl shadow-2xl p-12 text-center border-2 border-purple-3">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-emerald-5 to-emerald-6 shadow-lg">
            <Check className="h-12 w-12 text-light-1 stroke-[3]" />
          </div>
          <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-purple-7 via-purple-6 to-emerald-6 bg-clip-text text-transparent">
            Registration Success!
          </h2>
          <p className="text-gray-7 mb-8 text-base">
            Welcome to Ragnarok Guide! Your account has been created.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-purple-6 to-purple-5 text-light-1 py-3 rounded-lg font-bold text-base hover:from-purple-7 hover:to-purple-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Start Exploring
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-1 via-light-1 to-emerald-1 p-4">
      <div className="max-w-md w-full bg-light-1 rounded-2xl shadow-2xl p-8 border-2 border-purple-3">
        <h1 className="text-4xl font-bold text-center py-2 mb-4 bg-gradient-to-r from-purple-7 via-purple-6 to-purple-5 bg-clip-text text-transparent">
          Join Ragnarok
        </h1>
        <p className="text-center text-gray-7 mb-6">Create your account</p>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold gray-10 mb-2">Name</label>
            <input
              name="name"
              value={values.name}
              onChange={onChange}
              placeholder="Your name"
              className={[
                "w-full px-4 py-3 border-2 rounded-lg focus:outline-none gray-10 bg-light-1 font-medium placeholder:text-gray-6 transition-all",
                errors.name ? "border-error focus:border-error" : "border-purple-3 focus:border-purple-5",
              ].join(" ")}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-error font-medium">{errors.name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold gray-10 mb-2">Username</label>
            <input
              name="username"
              value={values.username}
              onChange={onChange}
              placeholder="username"
              className={[
                "w-full px-4 py-3 border-2 rounded-lg focus:outline-none gray-10 bg-light-1 font-medium placeholder:text-gray-6 transition-all",
                errors.username ? "border-error focus:border-error" : "border-purple-3 focus:border-purple-5",
              ].join(" ")}
            />
            {errors.username && (
              <p className="mt-2 text-sm text-error font-medium">{errors.username}</p>
            )}
            {getValidationResult('username').message && (
              <p className={`mt-2 text-sm font-medium ${
                getValidationResult('username').isValid ? 'success' : 'text-error'
              }`}>
                {getValidationResult('username').message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold gray-10 mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              placeholder="your@email.com"
              className={[
                "w-full px-4 py-3 border-2 rounded-lg focus:outline-none gray-10 bg-light-1 font-medium placeholder:text-gray-6 transition-all",
                errors.email ? "border-error focus:border-error" : "border-purple-3 focus:border-purple-5",
              ].join(" ")}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-error font-medium">{errors.email}</p>
            )}
            {getValidationResult('email').message && (
              <p className={`mt-2 text-sm font-medium ${
                getValidationResult('email').isValid ? 'success' : 'text-error'
              }`}>
                {getValidationResult('email').message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold gray-10 mb-2">Password</label>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={onChange}
              placeholder="••••••••"
              className={[
                "w-full px-4 py-3 border-2 rounded-lg focus:outline-none gray-10 bg-light-1 font-medium placeholder:text-gray-6 transition-all",
                errors.password ? "border-error focus:border-error" : "border-purple-3 focus:border-purple-5",
              ].join(" ")}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-error font-medium">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold gray-10 mb-2">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={onChange}
              placeholder="••••••••"
              className={[
                "w-full px-4 py-3 border-2 rounded-lg focus:outline-none gray-10 bg-light-1 font-medium placeholder:text-gray-6 transition-all",
                errors.confirmPassword ? "border-error focus:border-error" : "border-purple-3 focus:border-purple-5",
              ].join(" ")}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-error font-medium">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-6 to-purple-5 text-light-1 py-3 rounded-lg font-bold text-base hover:from-purple-7 hover:to-purple-6 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-7">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="purple-7 font-bold hover:purple-8 hover:underline decoration-purple-4 underline-offset-2 transition-all"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}