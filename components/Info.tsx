import React from 'react';
import { TUBE_LINE_COLORS } from '../constants';
import { TubeLine } from '../types';

const InfoPill: React.FC<{ text: string; color: string; textColor?: string; icon?: React.ReactNode }> = ({ text, color, textColor = 'white', icon }) => (
    <span className="flex items-center space-x-2 text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: color, color: textColor }}>
        {icon}
        <span>{text}</span>
    </span>
);

const RuleItem: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="text-3xl">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-200">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

const Info: React.FC = () => {

    const generateICS = () => {
        const event = {
            title: "Flat PPR Asri and Dzak's Housewarming Party!",
            description: "Join us for our housewarming party! Food, drinks, and good times.",
            location: "Flat 21, Sporle Court, London, SW11 2EP",
            startTime: "2025-10-25T11:00:00",
            endTime: "2025-10-25T21:00:00",
        };
        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MyHousewarming//EN
BEGIN:VEVENT
UID:${crypto.randomUUID()}@myhousewarming.party
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}Z
DTSTART;TZID=Europe/London:${event.startTime.replace(/[-:]/g, '')}
DTEND;TZID=Europe/London:${event.endTime.replace(/[-:]/g, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR
        `.trim();

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'housewarming.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">Getting There</h3>
                <div className="flex items-start space-x-4">
                     <div className="w-48 h-32 bg-gray-700 rounded-lg flex-shrink-0 relative overflow-hidden">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 -translate-y-1/2"></div>
                        <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-600 -translate-x-1/2"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-800 border-4 border-red-500"></div>
                     </div>
                     <div>
                        <p className="text-gray-200 font-medium">Our new place is at <span className="font-bold">Flat 21, Sporle Court, London, SW11 2EP.</span></p>
                        <p className="mt-2 text-gray-300">The nearest major station is:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <InfoPill text="Clapham Junction" color={TUBE_LINE_COLORS[TubeLine.OVERGROUND]} />
                        </div>
                     </div>
                </div>
            </div>

            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">House Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RuleItem icon="🕺" title="Mind the Moves" description="Feel free to dance, but please don't test the structural integrity of the floors." />
                    <RuleItem icon="🗣️" title="Platform Announcements" description="Inside voices after 10 PM. The neighbors are on a different line." />
                    <RuleItem icon="🎁" title="No Unattended Items" description="Your presence is the only present required! No gifts, please." />
                    <RuleItem icon="🚭" title="Designated Smoking Area" description="Please use the garden for any smoking or vaping." />
                </div>
            </div>
            
             <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">Platform Information</h3>
                <div className="space-y-4 text-gray-300">
                    <p><strong>What to Bring:</strong> Just yourselves and your station-themed costume! We'll provide food and drinks throughout the day.</p>
                    <p><strong>Contact:</strong> If you get lost on the network, send a signal to Jane on WhatsApp at <a href="tel:07123456789" className="text-blue-400 font-bold hover:underline">07123 456789</a>.</p>
                </div>
                <div className="mt-6 text-center">
                    <button onClick={generateICS} className="px-6 py-3 bg-[#00782A] text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-green-400">
                        Add to Calendar
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Info;