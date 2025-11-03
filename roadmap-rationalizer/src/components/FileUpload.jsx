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
            ? 'border-[rgba(67,160,137,0.85)] bg-[rgba(15,107,92,0.38)] scale-[1.02]' 
            : 'border-[rgba(67,160,137,0.35)] hover:border-[rgba(67,160,137,0.6)] bg-[rgba(7,27,23,0.55)] hover:bg-[rgba(11,61,52,0.65)] hover:shadow-satin'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isLoading} />
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(60%_60%_at_50%_40%,rgba(26,138,116,0.35)_0%,rgba(11,61,52,0.2)_55%,rgba(7,27,23,0.6)_100%)]" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-[rgba(67,160,137,0.45)] bg-[rgba(7,27,23,0.65)]">
            <svg
              className={`h-8 w-8 transition-colors duration-300 ${
                isDragActive ? 'text-gold-base' : 'text-seafoam group-hover:text-gold-base'
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
              <p className="text-lg font-semibold text-gold-base">Drop your files here</p>
            ) : (
              <>
                <p className="text-lg font-semibold text-fog">
                  {isLoading 
                    ? 'Processing your files...' 
                    : 'Upload your strategic documents'}
                </p>
                <p className="text-sm text-seafoam max-w-md mx-auto">
                  Drag & drop your files here, or <span className="text-gold-base font-medium">click to browse</span>
                </p>
              </>
            )}
          </div>

          {!isDragActive && !isLoading && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg font-medium border border-[rgba(67,160,137,0.45)] text-seafoam bg-[rgba(7,27,23,0.6)]">
                .txt
              </span>
              <span className="px-3 py-1.5 rounded-lg font-medium border border-[rgba(67,160,137,0.45)] text-seafoam bg-[rgba(7,27,23,0.6)]">
                .md
              </span>
              <span className="px-3 py-1.5 rounded-lg font-medium border border-[rgba(67,160,137,0.45)] text-seafoam bg-[rgba(7,27,23,0.6)]">
                .json
              </span>
              <span className="px-3 py-1.5 rounded-lg font-medium border border-[rgba(67,160,137,0.45)] text-seafoam bg-[rgba(7,27,23,0.6)]">
                .pdf
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

