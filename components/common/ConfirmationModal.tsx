import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: 'red' | 'blue' | 'green';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm Deletion",
  confirmColor = "red"
}) => {
  
  const getConfirmButtonStyles = () => {
    switch (confirmColor) {
      case 'blue':
        return "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      case 'green':
        return "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500";
      default:
        return "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500";
    }
  };

  const getLedColor = () => {
    switch (confirmColor) {
      case 'blue':
        return "bg-blue-400";
      case 'green':
        return "bg-green-400";
      default:
        return "bg-red-400";
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl w-full max-w-sm space-y-4 border-2 border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tube-style header */}
            <div className="flex items-center space-x-2 mb-4">
              <motion.div 
                className={`w-2 h-2 rounded-full ${getLedColor()}`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h2 className="text-xl font-mono font-bold text-white tracking-wider uppercase">{title}</h2>
            </div>
            
            <p className="text-gray-300 font-mono text-sm leading-relaxed">{message}</p>
            
            <div className="flex justify-end items-center pt-4 space-x-3">
              <motion.button
                onClick={onClose}
                className="px-5 py-2 text-sm font-mono font-semibold text-gray-200 bg-gray-700/80 rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-colors uppercase tracking-wide"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className={`px-5 py-2 text-sm font-mono font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors uppercase tracking-wide ${getConfirmButtonStyles()}`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
