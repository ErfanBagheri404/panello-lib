import { IoHappyOutline, IoSunnyOutline, IoBookOutline } from "react-icons/io5";

type SuggestionBoxesProps = {
  boxCommands: readonly string[][];
  onSelect: (command: string) => void;
  theme: string;
  startText: string;
  categories: string[];
};

const SuggestionBoxes = ({
  boxCommands,
  onSelect,
  theme,
  startText,
  categories,
}: SuggestionBoxesProps) => {
  const handleBoxSelect = (commands: readonly string[]) => {
    const selectedCommand = commands[Math.floor(Math.random() * commands.length)];
    onSelect(selectedCommand);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center flex-1 px-2">
      <h2
        className={`text-lg font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {startText}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full max-w-3xl">
        {boxCommands.map((commands, index) => (
          <div
            key={index}
            className={`p-3 md:p-4 rounded-lg border cursor-pointer transition duration-300 flex flex-col items-center justify-center ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                : "bg-white border-black/30 text-black hover:bg-gray-100"
            }`}
            onClick={() => handleBoxSelect(commands)}
          >
            {index === 0 && (
              <IoHappyOutline className="text-2xl md:text-3xl mb-2 text-blue-500" />
            )}
            {index === 1 && (
              <IoSunnyOutline className="text-2xl md:text-3xl mb-2 text-yellow-500" />
            )}
            {index === 2 && (
              <IoBookOutline className="text-2xl md:text-3xl mb-2 text-green-500" />
            )}
            <h3 className="text-sm md:text-md font-semibold">
              {categories[index]}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBoxes;