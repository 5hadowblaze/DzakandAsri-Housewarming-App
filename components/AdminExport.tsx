import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

// Your specific device identifier (you'll need to replace this with your actual MAC address)
const ADMIN_DEVICE_ID = "22:1e:85:9b:e0:a0"; // Replace with your actual MAC address

const AdminExport: React.FC = () => {
    const { allRsvps } = useAppContext();
    const [isAdmin, setIsAdmin] = useState(false);
    const [deviceId, setDeviceId] = useState('');
    const [showExportOptions, setShowExportOptions] = useState(false);

    // Function to get device fingerprint (combination of various device characteristics)
    const getDeviceFingerprint = async (): Promise<string> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Device fingerprint', 2, 2);
        }
        const canvasFingerprint = canvas.toDataURL();
        
        const screen = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        const platform = navigator.platform;
        const userAgent = navigator.userAgent;
        
        // Create a unique fingerprint
        const fingerprint = btoa(`${canvasFingerprint}-${screen}-${timezone}-${language}-${platform}-${userAgent}`);
        return fingerprint;
    };

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const fingerprint = await getDeviceFingerprint();
                setDeviceId(fingerprint.substring(0, 20) + '...'); // Show partial for debugging
                
                // For now, we'll use device fingerprint. You can replace this with your specific device ID
                // To get your device fingerprint, check the console log below and replace ADMIN_DEVICE_ID
                console.log('Your device fingerprint:', fingerprint);
                
                // Replace this condition with your actual device fingerprint
                const isAdminDevice = fingerprint === ADMIN_DEVICE_ID || 
                                    fingerprint.includes('YOUR_PARTIAL_FINGERPRINT_HERE'); // Add a partial match as backup
                
                setIsAdmin(isAdminDevice);
            } catch (error) {
                console.error('Error checking device access:', error);
            }
        };

        checkAdminAccess();
    }, []);

    const exportToCSV = () => {
        if (!allRsvps.length) {
            alert('No RSVP data to export');
            return;
        }

        // Create CSV content
        const headers = ['Name', 'Email', 'Station', 'Friend Group', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...allRsvps.map(rsvp => [
                `"${rsvp.name}"`,
                `"${rsvp.email}"`,
                `"${rsvp.stationId}"`,
                `"${rsvp.friendGroup}"`,
                `"${rsvp.createdAt ? new Date(rsvp.createdAt.seconds * 1000).toLocaleString() : 'N/A'}"`
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `housewarming-rsvps-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportEmailsOnly = () => {
        if (!allRsvps.length) {
            alert('No RSVP data to export');
            return;
        }

        // Extract just emails
        const emails = allRsvps.map(rsvp => rsvp.email).join('\n');
        
        // Create and download file
        const blob = new Blob([emails], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `housewarming-emails-${new Date().toISOString().split('T')[0]}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyEmailsToClipboard = async () => {
        if (!allRsvps.length) {
            alert('No RSVP data to copy');
            return;
        }

        const emails = allRsvps.map(rsvp => rsvp.email).join(', ');
        
        try {
            await navigator.clipboard.writeText(emails);
            alert('Email addresses copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy emails:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = emails;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Email addresses copied to clipboard!');
        }
    };

    // Don't render anything if not admin
    if (!isAdmin) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 left-4 z-50"
        >
            <motion.button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-3 rounded-full shadow-lg border-2 border-red-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Admin Export (Your Device Only)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </motion.button>

            <AnimatePresence>
                {showExportOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="absolute bottom-16 left-0 bg-black border-2 border-red-500 rounded-xl p-4 shadow-2xl min-w-64"
                    >
                        <div className="space-y-3">
                            <div className="text-red-400 font-mono text-sm font-bold tracking-wider uppercase border-b border-red-600 pb-2">
                                Admin Export ({allRsvps.length} RSVPs)
                            </div>
                            
                            <motion.button
                                onClick={exportToCSV}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-left px-3 py-2 text-green-400 hover:text-green-300 font-mono text-sm border border-green-600 rounded-lg transition-colors"
                            >
                                📄 Export Full CSV
                            </motion.button>
                            
                            <motion.button
                                onClick={exportEmailsOnly}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-left px-3 py-2 text-blue-400 hover:text-blue-300 font-mono text-sm border border-blue-600 rounded-lg transition-colors"
                            >
                                📧 Export Emails Only
                            </motion.button>
                            
                            <motion.button
                                onClick={copyEmailsToClipboard}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-left px-3 py-2 text-purple-400 hover:text-purple-300 font-mono text-sm border border-purple-600 rounded-lg transition-colors"
                            >
                                📋 Copy Emails to Clipboard
                            </motion.button>
                            
                            <div className="text-xs text-gray-500 font-mono pt-2 border-t border-gray-700">
                                Device: {deviceId}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminExport;