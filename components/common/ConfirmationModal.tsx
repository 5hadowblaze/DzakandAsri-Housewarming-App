import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
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
                className="w-2 h-2 bg-red-400 rounded-full"
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
                className="px-5 py-2 text-sm font-mono font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors uppercase tracking-wide"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirm Deletion
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
