export const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      {text}
    </button>
  );
};
