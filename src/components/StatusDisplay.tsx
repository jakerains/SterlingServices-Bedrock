import { useFileStore } from '../store/file';

export default function StatusDisplay() {
  const { file, currentStep, progress, statusMessage } = useFileStore();

  const steps = [
    { id: 'upload', title: 'File Upload', icon: '📁' },
    { id: 'transcribe', title: 'Audio Transcription', icon: '🎙️' },
    { id: 'analyze', title: 'Content Analysis', icon: '🔍' },
    { id: 'generate', title: 'Analysis Generation', icon: '📄' }
  ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['upload', 'transcribe', 'analyze', 'generate'];
    const stepIndex = stepOrder.indexOf(stepId);
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'in-progress';
    return 'pending';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Processing Status</h2>
          <div className="text-sm text-gray-500">{file?.name}</div>
        </div>

        {/* Current Status Message */}
        <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-sm text-gray-600 font-medium">
            {statusMessage || 'Initializing...'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute h-full rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(
                  45deg,
                  rgba(99, 102, 241, 1) 0%,
                  rgba(168, 85, 247, 1) 35%,
                  rgba(236, 72, 153, 1) 70%,
                  rgba(99, 102, 241, 1) 100%
                )`,
                backgroundSize: '200% 200%',
                animation: 'gradient 2s ease infinite'
              }}
            />
          </div>
          <div className="mt-2 text-right text-sm text-gray-500">{progress}%</div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            
            return (
              <div key={step.id} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute left-6 top-10 w-0.5 h-full -ml-px
                      ${status === 'completed' ? 'bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500' : 'bg-gray-200'}`}
                  />
                )}
                
                {/* Step Item */}
                <div className="relative flex items-center">
                  {/* Status Icon */}
                  <div 
                    className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg
                      ${status === 'completed' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 
                        status === 'in-progress' ? 'bg-indigo-500' : 
                        'bg-gray-100'}`}
                    style={status === 'in-progress' ? {
                      animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    } : undefined}
                  >
                    <span className={`text-lg ${status === 'completed' || status === 'in-progress' ? 'text-white' : 'text-gray-400'}`}>
                      {step.icon}
                    </span>
                  </div>

                  {/* Step Content */}
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {status === 'completed' ? 'Completed' :
                       status === 'in-progress' ? 'In Progress' :
                       'Pending'}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div 
                    className={`ml-4 flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium
                      ${status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                        status === 'in-progress' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' :
                        'bg-gray-50 text-gray-500'}`}
                    style={status === 'in-progress' ? {
                      backgroundSize: '200% 200%',
                      animation: 'gradient-flow 2s ease infinite'
                    } : undefined}
                  >
                    {status === 'completed' ? 'Complete' :
                     status === 'in-progress' ? 'Processing' :
                     'Pending'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}