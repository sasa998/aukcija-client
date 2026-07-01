import { Circle } from "lucide-react";

function PulsingCircle({ size = 6, color = "text-green-500" }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      <Circle
        className={`absolute animate-ping ${color} opacity-75`}
        size={size}
        fill="currentColor"
      />
      <Circle className={color} size={size} fill="currentColor" />
    </span>
  );
}

export default PulsingCircle;
