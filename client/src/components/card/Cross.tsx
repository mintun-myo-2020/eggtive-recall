import { IPositionData } from "../../interfaces/interfaces";

interface CrossProps {
  onMouseUp?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseDown?: (event: React.MouseEvent<SVGSVGElement>) => void;
}

const Cross = ({ onMouseUp, onMouseDown }: CrossProps) => {
  return (
    <svg
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="5 -5 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className=" h-10 float-right pt-2 hover:cursor-pointer transition duration-150 ease-in-out hover:text-yellow-100"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export default Cross;
