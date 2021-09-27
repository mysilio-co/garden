export function Hex({ children }) {
  return (
    <div>
      <div>
        <div className="flex flex-col justify-center items-center bg-lagoon-dark">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function HexGrid({ children }) {
  return <div className="grid hex gap-6 p-6">{children}</div>;
}
