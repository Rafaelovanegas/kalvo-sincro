
import React, { useState } from 'react';
import { ToolType } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ImageEditor from './components/ImageEditor';
import TextAssistant from './components/TextAssistant';
import AudioGenerator from './components/AudioGenerator';
import LiveTalk from './components/LiveTalk';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case ToolType.DASHBOARD:
        return <Dashboard onNavigate={setActiveTab} />;
      case ToolType.LIVE:
        return <LiveTalk />;
      case ToolType.IMAGE:
        return <ImageEditor />;
      case ToolType.TEXT:
        return <TextAssistant />;
      case ToolType.AUDIO:
        return <AudioGenerator />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="pb-12">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;