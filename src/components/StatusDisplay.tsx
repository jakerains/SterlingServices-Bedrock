import { useFileStore } from '../store/file';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const steps = [
  { id: 'upload', name: 'File Upload' },
  { id: 'transcribe', name: 'Audio Transcription' },
  { id: 'analyze', name: 'Content Analysis' },
  { id: 'generate', name: 'SOW Generation' },
];

export default function StatusDisplay() {
  const { file, processing, currentStep = 'upload', statusMessage, progress } = useFileStore();

  const getStepStatus = (stepId: string) => {
    const stepOrder = steps.findIndex(s => s.id === stepId);
    const currentStepOrder = steps.findIndex(s => s.id === currentStep);

    if (stepOrder < currentStepOrder) return 'complete';
    if (stepOrder === currentStepOrder) return processing ? 'current' : 'upcoming';
    return 'upcoming';
  };

  const getAnalysisDetails = () => {
    if (currentStep !== 'analyze' || !statusMessage) return null;
    
    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 text-indigo-600 mr-2" />
          <span className="text-xs text-gray-600">
            This may take several minutes depending on content length
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {statusMessage.includes('category:') && (
            <span className="font-medium text-indigo-600">
              {statusMessage}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (!file) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Processing Status
        </h2>
        <p className="text-sm text-gray-500">{file.name}</p>
      </div>

      {processing && statusMessage && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">{statusMessage}</p>
          {progress > 0 && (
            <div className="mt-2">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">{progress}%</p>
            </div>
          )}
          {processing && currentStep === 'analyze' && getAnalysisDetails()}
        </div>
      )}

      <div className="mt-6">
        <div className="overflow-hidden rounded-lg">
          <ul role="list" className="-mb-8">
            {steps.map((step, stepIdx) => {
              const status = getStepStatus(step.id);
              return (
                <li key={step.id}>
                  <div className="relative pb-8">
                    {stepIdx !== steps.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-inset ${
                            status === 'complete'
                              ? 'bg-indigo-50 ring-indigo-600'
                              : status === 'current'
                              ? 'bg-white ring-indigo-600'
                              : 'bg-white ring-gray-300'
                          }`}
                        >
                          {status === 'complete' ? (
                            <CheckCircleSolidIcon
                              className="h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                          ) : status === 'current' ? (
                            <ClockIcon
                              className="h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                          ) : (
                            <CheckCircleIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              status === 'complete'
                                ? 'text-indigo-600'
                                : status === 'current'
                                ? 'text-gray-900'
                                : 'text-gray-500'
                            }`}
                          >
                            {step.name}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          {status === 'complete' && 'Completed'}
                          {status === 'current' && processing && 'In Progress'}
                          {status === 'current' && !processing && 'Ready'}
                          {status === 'upcoming' && 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}