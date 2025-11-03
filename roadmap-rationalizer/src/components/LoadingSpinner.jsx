export default function LoadingSpinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        {/* Outer spinning ring */}
        <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        
        {/* Middle spinning ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="w-12 h-12 border-3 border-secondary-200 border-b-secondary-600 rounded-full animate-spin" 
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>
        
        {/* Center icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white animate-pulse-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {message && (
        <div className="text-center max-w-md">
          <p className="text-neutral-900 font-semibold text-lg mb-2">{message}</p>
          <p className="text-neutral-600 text-sm">
            Our AI is analyzing your strategic options and assessing risks across multiple dimensions
          </p>
        </div>
      )}
      
      {/* Progress indicator dots */}
      <div className="flex items-center gap-2 mt-6">
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
}

