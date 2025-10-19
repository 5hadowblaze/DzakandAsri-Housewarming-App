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
                    <RuleItem icon="🚇" title="Mind the Gap (and the Furniture)" description="Have fun, move around, but let’s keep the chairs, tables, and floors in service for the next passenger." />
                    <RuleItem icon="🍰" title="Open Kitchen Policy" description="Feel free to bring anything you want — if you’d like to cook something up or make a dessert, we’re all for it. The more the merrier (and tastier)." />
                    <RuleItem icon="🥂" title="Refill, Recycle, Repeat" description="Top up your drink, label your cup with your name, and chuck empties into the right bin. Sustainability never goes off-peak." />
                    <RuleItem icon="🕺" title="Stay on Track" description="Dance, mingle, vibe — but keep it classy. If the floor starts shaking, that’s your signal to mind the moves." />
                    <RuleItem icon="👟" title="Shoes & Coats" description="Shoes off at the door, please. Coats can go on the coat rack — not on the sofa." />
                    <RuleItem icon="🎶" title="Volume Control" description="Tunes up, drama down. Keep the vibes groovy till 10:30, then we switch to the chill line." />
                    <RuleItem icon="🚭" title="Smoking & Vaping" description="Only on the balcony or outside — this isn’t the steam train era." />
                    <RuleItem icon="🍕" title="Food Service" description="Help yourself, share the snacks, and please don’t treat the sofa like a dining car. Let us know of any dietary needs before digging in." />
                    <RuleItem icon="📸" title="Photo Etiquette" description="Flash only with consent — not everyone’s ready for the front page of the Evening Standard. Also, be mindful of camera equipment and devices around the house — they’re not lost property." />
                    <RuleItem icon="🧃" title="Spill Station" description="Try not to spill, but if you do — no worries! Just shout “spill!” and we’ll sort it." />
                    <RuleItem icon="🛋️" title="Restricted Zones" description="Bedrooms and desks are first-class only (for coats, charging phones, and storage)." />
                    <RuleItem icon="🧻" title="Bathroom Bureau" description="Flush properly, keep it dry, and if you finish the roll — restock before your next stop." />
                    <RuleItem icon="🚪" title="Departures" description="Say bye to the host, take your belongings, and mind the door on your way out." />
                </div>
            </div>
            
             <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">Platform Information</h3>
                <div className="space-y-4 text-gray-300">
                    <p><strong>What to Bring:</strong> Just yourselves and your station-themed costume! We'll provide food and drinks throughout the day.</p>
                    <p><strong>Contact:</strong> Need anything? Contact Amir Dzakwan — WhatsApp: <a href="https://wa.me/60178461844" className="text-blue-400 font-bold hover:underline">+6017 846 1844</a> | Mobile (UK): <a href="tel:+447570478826" className="text-blue-400 font-bold hover:underline">+44 7570 478826</a> or Asri at <a href="tel:+447551943933" className="text-blue-400 font-bold hover:underline">+44 7551 943933</a>.</p>
                    <div>
                        <p className="font-bold text-gray-100">📶 Onboard Wi-Fi</p>
                        <p>Network: <span className="font-semibold text-gray-100">Flat PPR Housewarming Wifi</span></p>
                        <p>Password: <span className="font-semibold text-gray-100">mindthegap</span></p>
                    </div>
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
