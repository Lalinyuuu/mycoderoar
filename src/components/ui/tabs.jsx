import * as React from "react";

// Create Context for Tabs
const TabsContext = React.createContext();

const Tabs = ({ defaultValue, value, onValueChange, children, className = "" }) => {
  const [internalSelectedTab, setInternalSelectedTab] = React.useState(defaultValue);
  
  // Use controlled value if provided, otherwise use internal state
  const selectedTab = value !== undefined ? value : internalSelectedTab;

  const handleValueChange = (newValue) => {
    setInternalSelectedTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ selectedTab, onValueChange: handleValueChange }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = "" }) => {
  return (
    <div className={`inline-flex h-12 items-center justify-start rounded-xl bg-purple-9/40 p-1 text-gray-5 backdrop-blur-sm border border-purple-8/30 overflow-x-auto scrollbar-hide ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, className = "" }) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    return null;
  }
  
  const { selectedTab, onValueChange } = context;
  const isActive = selectedTab === value;

  return (
    <button
      onClick={() => {
        if (onValueChange) {
          onValueChange(value);
        } else {
        }
      }}
      data-state={isActive ? "active" : "inactive"}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-5 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-purple-6 text-white shadow-md"
          : "bg-purple-1 text-purple-7 hover:bg-purple-2"
      } ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className = "" }) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    return null;
  }
  
  const { selectedTab } = context;
  
  if (selectedTab !== value) return null;

  return (
    <div className={`mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-5 ${className}`}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
