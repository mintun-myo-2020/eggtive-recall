import { IPositionData } from "../../interfaces/interfaces";

interface CrossProps {
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLButtonElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement>) => void;
}

const Cross = ({ onMouseUp, onMouseDown }: CrossProps) => {
  return (
    <button
      className="absolute top-0 right-0 m-2 p-2 text-gray-700 hover:text-gray-200 transition-colors duration-300 ease-in-out focus:outline-none"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default Cross;
