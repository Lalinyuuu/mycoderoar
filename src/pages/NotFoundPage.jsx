import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-1">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-purple-8 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-6 mb-6 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button
            variant="primary"
            size="lg"
            icon={<Home className="w-4 h-4" />}
            className="bg-gradient-to-r from-purple-6 to-purple-5 hover:from-purple-7 hover:to-purple-6"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
