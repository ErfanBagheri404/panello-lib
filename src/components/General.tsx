import LanguageSelector from "./LanguageSelector";
import { useTheme } from "../components/theme-provider"; // adjust the import path as necessary
const General = () => {
      const { theme, setTheme } = useTheme(); // Access the theme context
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col w-1/3">
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-gray-500">Update your Profile Picture.</p>
        </div>
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-gray-200 border border-black/30 flex items-center justify-center rounded-xl">
              {/* Placeholder for logo */}
            </div>
            <button className="px-3 py-1 rounded-lg bg-white border border-black/30">
              Replace image
            </button>
          </div>
          <button className="text-red-500 bg-red-100 px-3 py-1 rounded-lg">
            Remove
          </button>
        </div>
      </div>

      {/* Interface Theme */}
      <div className="flex items-center">
        <div className="flex flex-col w-1/3">
          <h3 className="text-lg font-medium">Interface theme</h3>
          <p className="text-sm text-gray-500">
            Select or customize your UI theme.
          </p>
        </div>
        <div className="flex gap-4 mt-2 w-full">
          {["System preference", "Light", "Dark"].map((theme) => (
            <div
              key={theme}
              className={`w-32 h-20 rounded-md border-2 p-2 flex items-center justify-center cursor-pointer ${
                theme === "System preference"
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            >
              <span className="text-sm">{theme}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Sidebar */}

      {/* Sidebar Feature */}
      <div className="flex">
        <div className="flex flex-col w-1/3">
          <h3 className="text-lg font-medium">Sidebar feature</h3>
          <p className="text-sm text-gray-500">
            What shows in the desktop sidebar.
          </p>
        </div>
        <div className="flex flex-col w-full">
          <select className="mt-2 border rounded-md px-3 py-2 w-fit">
            <option>Recent changes</option>
            <option>Favorites</option>
            <option>Shortcuts</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col w-1/3">
          <h3 className="text-lg font-medium">Language</h3>
          <p className="text-sm text-gray-500">Change Dashboard's language.</p>
        </div>
        <div className="w-full">
          <LanguageSelector></LanguageSelector>
        </div>
      </div>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-4 py-2 border rounded-full bg-gray-300"
      >
        Toggle Dark Mode
      </button>
    </div>
  );
};

export default General;
