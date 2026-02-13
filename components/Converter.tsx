
import React, { useState, useCallback } from 'react';
import { CONVERSION_OPTIONS } from '../constants';
import { ConversionType } from '../types';
import { convertConfiguration } from '../services/geminiService';

const Converter: React.FC = () => {
  const [activeType, setActiveType] = useState<ConversionType>(ConversionType.VRF);
  const [inputConfig, setInputConfig] = useState('');
  const [outputConfig, setOutputConfig] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const activeOption = CONVERSION_OPTIONS.find(opt => opt.id === activeType)!;

  const handleConvert = useCallback(async () => {
    if (!inputConfig.trim()) {
      setError('Input configuration cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutputConfig('');
    try {
      const result = await convertConfiguration(activeType, inputConfig);
      setOutputConfig(result);
    } catch (e) {
      setError('Failed to convert configuration. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [activeType, inputConfig]);

  const handleClear = () => {
    setInputConfig('');
    setOutputConfig('');
    setError(null);
  };

  const handleCopy = () => {
    if (outputConfig) {
      navigator.clipboard.writeText(outputConfig);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const loadExample = () => {
    setInputConfig(activeOption.example);
  };

  const renderTab = (option: typeof CONVERSION_OPTIONS[0]) => (
    <button
      key={option.id}
      onClick={() => setActiveType(option.id)}
      className={`flex-1 flex items-center justify-center p-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
        activeType === option.id
          ? 'border-blue-600 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      }`}
    >
      {option.icon}
      {option.name}
    </button>
  );

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-12">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900">Configuration Converter</h2>
        <p className="text-gray-500 mt-1">Select a conversion type below and paste your Cisco configuration</p>
      </div>

      <div className="flex border-t border-b border-gray-200 bg-gray-50/50">
        {CONVERSION_OPTIONS.map(renderTab)}
      </div>

      <div className="p-6 sm:p-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg flex items-center space-x-4">
          {/* FIX: Cast the icon to a ReactElement with a className prop to satisfy TypeScript for React.cloneElement. */}
          <div className="text-blue-500">{React.cloneElement(activeOption.icon as React.ReactElement<{ className?: string }>, { className: 'w-8 h-8' })}</div>
          <div>
            <h3 className="font-bold">{activeOption.title}</h3>
            <p className="text-sm">{activeOption.description}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-700">
                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">Cisco IOS</span> Input Configuration
              </h4>
              <button onClick={loadExample} className="text-sm font-medium text-blue-600 hover:underline">Load Example</button>
            </div>
            <textarea
              value={inputConfig}
              onChange={(e) => setInputConfig(e.target.value)}
              placeholder={`Paste your Cisco ${activeOption.name} configuration here...`}
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none font-mono text-sm bg-gray-50"
            />
          </div>

          {/* Output Panel */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-700">
                <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Huawei VRP</span> Output Configuration
              </h4>
            </div>
            <div className="relative w-full h-80 p-4 border border-gray-300 rounded-lg bg-gray-900 text-white font-mono text-sm overflow-auto">
              {isLoading ? (
                 <div className="flex items-center justify-center h-full">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Converting...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words">{outputConfig || 'Converted Huawei configuration will appear here...'}</pre>
              )}
            </div>
          </div>
        </div>

        {error && <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button onClick={handleClear} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Clear
          </button>
          <button onClick={handleCopy} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {copySuccess ? (
                <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
            ) : (
                <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy Output</>
            )}
          </button>
          <button onClick={handleConvert} disabled={isLoading} className="w-full sm:w-auto flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            {isLoading ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Converter;
