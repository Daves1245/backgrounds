import React from 'react';

interface BackgroundControlsProps {
  settings: {
    circle1Dots: number;
    circle2Dots: number;
    circle3Dots: number;
    circle4Dots: number;
    circle5Dots: number;
    connectionDistance: number;
    baseRotationSpeed: number;
    rotationProportion: number;
  };
  onSettingChange: (setting: string, value: number) => void;
  modulatedSettings: {
    circle1Dots: boolean;
    circle2Dots: boolean;
    circle3Dots: boolean;
    circle4Dots: boolean;
    circle5Dots: boolean;
    connectionDistance: boolean;
    baseRotationSpeed: boolean;
    rotationProportion: boolean;
  };
  onModulationToggle: (setting: string) => void;
  onModulateAll: (active: boolean) => void;
  onExportSettings: () => void;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({ 
  settings, 
  onSettingChange, 
  modulatedSettings, 
  onModulationToggle,
  onModulateAll,
  onExportSettings
}) => {
  const allModulated = Object.values(modulatedSettings).every(val => val);
  
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black/30 backdrop-blur-md p-4 rounded-lg z-20 text-white controls-panel">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold">Background Controls</h3>
        
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onExportSettings();
            }}
            className="px-3 py-2 rounded-md font-medium bg-blue-500 hover:bg-blue-600 transition-colors"
            title="Copy a shareable URL with current settings"
          >
            Export Settings
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onModulateAll(!allModulated);
            }}
            className={`px-3 py-2 rounded-md font-medium ${
              allModulated ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
            } transition-colors`}
          >
            {allModulated ? 'Stop All Modulation' : 'Modulate All Settings'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Circle 1 Dots: {Math.round(settings.circle1Dots)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onModulationToggle('circle1Dots');
              }}
              className={`px-2 py-1 text-xs rounded ${modulatedSettings.circle1Dots ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {modulatedSettings.circle1Dots ? 'Modulating' : 'Modulate'}
            </button>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={settings.circle1Dots}
            onChange={(e) => onSettingChange('circle1Dots', parseInt(e.target.value))}
            className="w-full"
            disabled={modulatedSettings.circle1Dots}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Circle 2 Dots: {Math.round(settings.circle2Dots)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onModulationToggle('circle2Dots');
              }}
              className={`px-2 py-1 text-xs rounded ${modulatedSettings.circle2Dots ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {modulatedSettings.circle2Dots ? 'Modulating' : 'Modulate'}
            </button>
          </div>
          <input
            type="range"
            min="10"
            max="150"
            value={settings.circle2Dots}
            onChange={(e) => onSettingChange('circle2Dots', parseInt(e.target.value))}
            className="w-full"
            disabled={modulatedSettings.circle2Dots}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Circle 3 Dots: {Math.round(settings.circle3Dots)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onModulationToggle('circle3Dots');
              }}
              className={`px-2 py-1 text-xs rounded ${modulatedSettings.circle3Dots ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {modulatedSettings.circle3Dots ? 'Modulating' : 'Modulate'}
            </button>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.circle3Dots}
            onChange={(e) => onSettingChange('circle3Dots', parseInt(e.target.value))}
            className="w-full"
            disabled={modulatedSettings.circle3Dots}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Circle 4 Dots: {Math.round(settings.circle4Dots)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onModulationToggle('circle4Dots');
              }}
              className={`px-2 py-1 text-xs rounded ${modulatedSettings.circle4Dots ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {modulatedSettings.circle4Dots ? 'Modulating' : 'Modulate'}
            </button>
          </div>
          <input
            type="range"
            min="5"
            max="80"
            value={settings.circle4Dots}
            onChange={(e) => onSettingChange('circle4Dots', parseInt(e.target.value))}
            className="w-full"
            disabled={modulatedSettings.circle4Dots}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Circle 5 Dots: {Math.round(settings.circle5Dots)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onModulationToggle('circle5Dots');
              }}
              className={`px-2 py-1 text-xs rounded ${modulatedSettings.circle5Dots ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {modulatedSettings.circle5Dots ? 'Modulating' : 'Modulate'}
            </button>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            value={settings.circle5Dots}
            onChange={(e) => onSettingChange('circle5Dots', parseInt(e.target.value))}
            className="w-full"
            disabled={modulatedSettings.circle5Dots}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Connection Distance: {Math.round(settings.connectionDistance)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onModulationToggle('connectionDistance');
              }}
              className={`px-2 py-1 text-xs rounded ${modulatedSettings.connectionDistance ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {modulatedSettings.connectionDistance ? 'Modulating' : 'Modulate'}
            </button>
          </div>
          <input
            type="range"
            min="50"
            max="400"
            value={settings.connectionDistance}
            onChange={(e) => onSettingChange('connectionDistance', parseInt(e.target.value))}
            className="w-full"
            disabled={modulatedSettings.connectionDistance}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Base Rotation Speed: {settings.baseRotationSpeed.toFixed(4)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onModulationToggle('baseRotationSpeed');
              }}
              className={`px-2 py-1 text-xs rounded ${modulatedSettings.baseRotationSpeed ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {modulatedSettings.baseRotationSpeed ? 'Modulating' : 'Modulate'}
            </button>
          </div>
          <input
            type="range"
            min="0.0001"
            max="0.005"
            step="0.0001"
            value={settings.baseRotationSpeed}
            onChange={(e) => onSettingChange('baseRotationSpeed', parseFloat(e.target.value))}
            className="w-full"
            disabled={modulatedSettings.baseRotationSpeed}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Rotation Proportion: {settings.rotationProportion.toFixed(1)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onModulationToggle('rotationProportion');
              }}
              className={`px-2 py-1 text-xs rounded ${modulatedSettings.rotationProportion ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {modulatedSettings.rotationProportion ? 'Modulating' : 'Modulate'}
            </button>
          </div>
          <input
            type="range"
            min="-5"
            max="-1"
            step="0.1"
            value={settings.rotationProportion}
            onChange={(e) => onSettingChange('rotationProportion', parseFloat(e.target.value))}
            className="w-full"
            disabled={modulatedSettings.rotationProportion}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundControls;
