import React, { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { storage } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";

interface PhotoData {
  id: string;
  url: string;
  name: string;
  uploadedAt: Date;
}

export const Photos = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing photos from Firebase Storage on component mount
  useEffect(() => {
    console.log('Photos component mounted, loading photos...');
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      console.log('Loading photos from Firebase Storage...');
      console.log('Storage bucket:', storage?.app?.options?.storageBucket);
      
      // Check if storage is properly configured
      if (!storage) {
        console.error('Firebase Storage is not initialized');
        setPhotos([]);
        return;
      }
      
      // Check if we have a storage bucket configured
      if (!storage.app.options.storageBucket) {
        console.error('No storage bucket configured in Firebase config');
        setPhotos([]);
        return;
      }
      
      const photosRef = ref(storage, 'photos');
      console.log('Storage reference created:', photosRef);
      console.log('Full storage path:', photosRef.fullPath);
      
      const photosList = await listAll(photosRef);
      console.log('Photos list result:', photosList);
      console.log('Number of items found:', photosList.items.length);
      console.log('Items:', photosList.items.map(item => ({ name: item.name, fullPath: item.fullPath })));
      
      if (photosList.items.length === 0) {
        console.log('No photos found in storage');
        setPhotos([]);
        return;
      }
      
      const photoPromises = photosList.items.map(async (itemRef) => {
        try {
          console.log('Getting download URL for:', itemRef.name);
          const url = await getDownloadURL(itemRef);
          console.log('Download URL obtained for', itemRef.name, ':', url);
          return {
            id: itemRef.name,
            url,
            name: itemRef.name,
            uploadedAt: new Date()
          };
        } catch (error) {
          console.error('Error getting download URL for', itemRef.name, error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          return null;
        }
      });
      
      const loadedPhotos = (await Promise.all(photoPromises)).filter(photo => photo !== null);
      console.log('Loaded photos count:', loadedPhotos.length);
      console.log('Loaded photos:', loadedPhotos);
      setPhotos(loadedPhotos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()));
    } catch (error) {
      console.error('Error loading photos:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      console.error('Full error object:', error);
      
      // If it's a permission or CORS error, set photos to empty array
      if (error?.code === 'storage/unauthorized' || error?.code === 'storage/unknown' || error?.code === 'storage/invalid-url') {
        console.log('Storage access issue detected, setting empty photos array');
        setPhotos([]);
      } else {
        // For other errors, still set empty array but log more details
        console.log('Unknown error occurred, setting empty photos array');
        setPhotos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadPhotos = async () => {
    if (files.length === 0) return;
    
    try {
      setUploading(true);
      console.log('Starting photo upload process...');
      console.log('Files to upload:', files);
      
      // Check if storage is properly configured
      if (!storage) {
        throw new Error('Firebase Storage is not initialized');
      }
      
      const uploadPromises = files.map(async (file) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const photoRef = ref(storage, `photos/${fileName}`);
        
        console.log('Uploading file:', fileName);
        await uploadBytes(photoRef, file);
        console.log('File uploaded, getting download URL...');
        const url = await getDownloadURL(photoRef);
        console.log('Download URL obtained:', url);
        
        return {
          id: fileName,
          url,
          name: file.name,
          uploadedAt: new Date()
        };
      });
      
      const uploadedPhotos = await Promise.all(uploadPromises);
      console.log('All photos uploaded successfully:', uploadedPhotos);
      setPhotos(prev => [...uploadedPhotos, ...prev]);
      setFiles([]); // Clear the preview files
      
      // Reset the file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      alert(`Successfully uploaded ${uploadedPhotos.length} photo(s)!`);
      
    } catch (error) {
      console.error('Error uploading photos:', error);
      console.error('Error details:', error.code, error.message);
      
      let errorMessage = 'Error uploading photos. ';
      if (error.code === 'storage/unauthorized') {
        errorMessage += 'Storage access is not authorized. Please check Firebase Storage configuration.';
      } else if (error.code === 'storage/unknown') {
        errorMessage += 'Firebase Storage may not be enabled for this project.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const removeFileFromPreview = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removePhoto = async (photoId: string) => {
    try {
      const photoRef = ref(storage, `photos/${photoId}`);
      await deleteObject(photoRef);
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white tracking-wider uppercase mb-4"
          animate={{ 
            textShadow: [
              "0 0 10px #3b82f6",
              "0 0 20px #3b82f6", 
              "0 0 10px #3b82f6"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Photo Archive
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base lg:text-lg text-gray-300 font-mono tracking-wide px-4"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          PASSENGER MEMORY CAPTURE & STORAGE SYSTEM
        </motion.p>
      </motion.div>

      {/* Upload Section */}
      <motion.div 
        className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Tube-style header */}
        <div className="bg-black border-b border-gray-600 p-4">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white font-mono text-xl font-bold tracking-wider">MEMORY UPLOAD TERMINAL</span>
          </div>
          <motion.div 
            className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Select and preview your station memories
          </motion.div>
        </div>

        <div className="p-6">
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-2xl cursor-pointer bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
          >
            <motion.div 
              className="flex flex-col items-center justify-center pt-5 pb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.svg
                className="w-12 h-12 mb-4 text-blue-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </motion.svg>
              <p className="mb-2 text-lg font-mono font-bold text-blue-300 uppercase tracking-wide">
                Upload Station Memories
              </p>
              <p className="text-sm font-mono text-gray-400 uppercase tracking-wide">
                PNG, JPG or GIF Files Accepted
              </p>
            </motion.div>
            <input
              id="photo-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          
          {/* Upload Button */}
          {files.length > 0 && (
            <motion.div 
              className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-2 text-gray-300 font-mono text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>{files.length} file(s) selected</span>
              </div>
              <motion.button
                onClick={uploadPhotos}
                disabled={uploading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold py-3 px-6 rounded-xl border border-blue-500 transition-all duration-300 disabled:cursor-not-allowed"
                whileHover={{ scale: uploading ? 1 : 1.05 }}
                whileTap={{ scale: uploading ? 1 : 0.95 }}
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  'Upload to Archive'
                )}
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Debug Section */}
      <motion.div 
        className="bg-gradient-to-b from-red-900 to-red-800 border-2 border-red-600 rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-black border-b border-red-600 p-4">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 bg-red-400 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white font-mono text-xl font-bold tracking-wider">DEBUG TERMINAL</span>
          </div>
        </div>
        <div className="p-6">
          <motion.button
            onClick={() => {
              console.log('Manual photo reload triggered...');
              loadPhotos();
            }}
            className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold py-3 px-6 rounded-xl border border-red-500 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reload Photos (Check Console)
          </motion.button>
          <p className="text-red-300 font-mono text-sm mt-2">
            Check browser console (F12) for detailed debugging information
          </p>
        </div>
      </motion.div>

      {/* Preview Section - Selected Files */}
      {files.length > 0 && (
        <motion.div 
          className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-yellow-600 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-black border-b border-yellow-600 p-4">
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-2 h-2 bg-yellow-400 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white font-mono text-xl font-bold tracking-wider">PREVIEW CHAMBER</span>
            </div>
            <motion.div 
              className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {files.length} Files Ready for Upload
            </motion.div>
          </div>

          <div className="p-6">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
            >
              {files.map((file, index) => (
                <motion.div 
                  key={index} 
                  className="relative bg-black/40 rounded-2xl overflow-hidden border border-yellow-600 shadow-lg group"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {/* Remove button - appears on hover */}
                    <motion.button
                      onClick={() => removeFileFromPreview(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Remove from preview"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-yellow-300 font-mono text-xs font-bold uppercase tracking-wide">Preview {index + 1}</span>
                      </div>
                      <motion.button
                        onClick={() => removeFileFromPreview(index)}
                        className="text-red-400 hover:text-red-300 font-mono text-xs uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove
                      </motion.button>
                    </div>
                    <p className="text-gray-300 font-mono text-sm truncate">{file.name}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Uploaded Photos Gallery */}
      {loading ? (
        <motion.div 
          className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono text-lg">Loading Station Archives...</span>
            </div>
          </div>
        </motion.div>
      ) : photos.length > 0 ? (
        <motion.div 
          className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-black border-b border-gray-600 p-4">
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white font-mono text-xl font-bold tracking-wider">STATION ARCHIVES</span>
            </div>
            <motion.div 
              className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {photos.length} Memories Preserved
            </motion.div>
          </div>

          <div className="p-6">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
            >
              {photos.map((photo, index) => (
                <motion.div 
                  key={photo.id} 
                  className="relative bg-black/40 rounded-2xl overflow-hidden border border-gray-600 shadow-lg group"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.url}
                      alt={`Station Memory ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  
                  {/* Delete Button - appears on hover */}
                  <motion.button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                  
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-green-300 font-mono text-xs font-bold uppercase tracking-wide">Archive {index + 1}</span>
                    </div>
                    <p className="text-gray-300 font-mono text-sm truncate">{photo.name}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-8 text-center">
            <div className="text-gray-400 font-mono">
              <div className="text-4xl mb-4">📸</div>
              <div className="text-lg mb-2">No Station Archives Found</div>
              <div className="text-sm">Upload your first memory to begin the archive</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
