import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Plan from './components/Plan';
import Info from './components/Info';
import { Photos } from './components/Photos';
import Splash from './components/Splash';
import { AppTab } from './types';

const MainApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AppTab>('plan');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'plan':
                return <Plan />;
            case 'info':
                return <Info />;
            case 'photos':
                return <Photos />;
            default:
                return <Plan />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <main className="py-8 px-2 sm:px-4">
                <div className="container mx-auto">
                    {renderTabContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};


const App: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);

    if (showSplash) {
        return <Splash onFinished={() => setShowSplash(false)} />;
    }

    return (
        <AppProvider>
            <MainApp />
        </AppProvider>
    );
};

export default App;
