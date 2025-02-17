
const HomeTasks = () => {
  return (
    <div className="p-5 bg-white rounded-xl border border-black/30">
      <h2 className="text-xl font-semibold mb-5">My Tasks</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl">
              <span className="text-xl font-bold">+</span>
            </div>
            <p className="font-medium text-md">Add a new task</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl"
              style={{
                background:
                  "linear-gradient(55deg, #4B00FF -25.4%, #000 137.29%)",
              }}
            />
            <div>
              <p className="font-medium text-md">Team brainstorm</p>
              <p className="text-sm text-gray-500">2 tasks • 32 members</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl"
              style={{
                background:
                  "linear-gradient(55deg, #008000 -25.4%, #000 137.29%)",
              }}
            />
            <div>
              <p className="font-medium text-md">Product Lunch</p>
              <p className="text-sm text-gray-500">2 tasks • 32 members</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl"
              style={{
                background:
                  "linear-gradient(55deg, #FF0000 -25.4%, #000 137.29%)",
              }}
            />
            <div>
              <p className="font-medium text-md">Branding Lunch</p>
              <p className="text-sm text-gray-500">2 tasks • 32 members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTasks;
