import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function SignUpPage() {
  useEffect(() => {
    document.title = "Sign up — hh.";
  }, []);

  const navigate = useNavigate();


  const [values, setValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); 
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" })); 
  };

  const validate = () => {
    const err = {};
    if (!values.name.trim()) err.name = "Please enter your name.";
    if (!values.username.trim()) err.username = "Please enter a username.";

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
    if (!emailOk) err.email = "Email must be a valid email";

    if ((values.password || "").length < 6)
      err.password = "Password must be at least 6 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // simulate API
    await new Promise((r) => setTimeout(r, 600));


    try {
      const list = JSON.parse(localStorage.getItem("hh_signups") || "[]");
      list.push(values);
      localStorage.setItem("hh_signups", JSON.stringify(list));
    } catch {}

    setSubmitting(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <main className="px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-[#F3F2EE] p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Registration success
          </h2>

          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800"
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-[#F3F2EE] p-8 md:p-12">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight">
          Sign up
        </h1>

        <form onSubmit={onSubmit} noValidate className="mx-auto max-w-2xl space-y-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <input
              name="name"
              value={values.name}
              onChange={onChange}
              placeholder="Full name"
              className={[
                "w-full rounded-md border px-4 py-3 outline-none",
                errors.name ? "border-red-500" : "border-neutral-300 focus:border-neutral-500",
              ].join(" ")}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>
            <input
              name="username"
              value={values.username}
              onChange={onChange}
              placeholder="Username"
              className={[
                "w-full rounded-md border px-4 py-3 outline-none",
                errors.username ? "border-red-500" : "border-neutral-300 focus:border-neutral-500",
              ].join(" ")}
            />
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              placeholder="Email"
              className={[
                "w-full rounded-md border px-4 py-3 outline-none",
                errors.email ? "border-red-500" : "border-neutral-300 focus:border-neutral-500",
              ].join(" ")}
            />
            {errors.email ? (
              <p className="mt-2 text-sm text-red-600">Email must be a valid email</p>
            ) : null}
          </div>

      
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={onChange}
              placeholder="Password"
              className={[
                "w-full rounded-md border px-4 py-3 outline-none",
                errors.password ? "border-red-500" : "border-neutral-300 focus:border-neutral-500",
              ].join(" ")}
            />
            {errors.password ? (
              <p className="mt-2 text-sm text-red-600">
                Password must be at least 6 characters
              </p>
            ) : null}
          </div>

     
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-900 px-8 text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              {submitting ? "Signing up..." : "Sign up"}
            </button>
          </div>

      
          <p className="pt-2 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}