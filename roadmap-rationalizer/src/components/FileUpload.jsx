import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({ onFilesSelected, isLoading }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md'],
      'application/json': ['.json'],
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 md:p-12 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
            : 'border-neutral-300 hover:border-primary-400 bg-neutral-50/50 hover:bg-white hover:shadow-soft'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isLoading} />
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/30 to-secondary-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg
              className={`h-8 w-8 transition-colors duration-300 ${
                isDragActive ? 'text-primary-600' : 'text-neutral-500 group-hover:text-primary-600'
              }`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            {isDragActive ? (
              <p className="text-lg font-semibold text-primary-700">Drop your files here</p>
            ) : (
              <>
                <p className="text-lg font-semibold text-neutral-900">
                  {isLoading 
                    ? 'Processing your files...' 
                    : 'Upload your strategic documents'}
                </p>
                <p className="text-sm text-neutral-600 max-w-md mx-auto">
                  Drag & drop your files here, or <span className="text-primary-600 font-medium">click to browse</span>
                </p>
              </>
            )}
          </div>

          {!isDragActive && !isLoading && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-600 font-medium shadow-sm">
                .txt
              </span>
              <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-600 font-medium shadow-sm">
                .md
              </span>
              <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-600 font-medium shadow-sm">
                .json
              </span>
              <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-600 font-medium shadow-sm">
                .pdf
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

