import { create } from 'zustand';

export const useVisualizerStore = create((set, get) => ({
  code: '',
  language: 'auto',
  analysis: null,
  isAnalyzing: false,
  error: null,
  currentStep: 0,
  totalSteps: 0,
  isPlaying: false,
  playbackSpeed: 1,
  visualizationType: 'generic',
  selectedAlgorithm: null,
  eli5Mode: false,
  explanation: '',
  showAIPanel: true,
  sidebarOpen: true,
  
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setAnalysis: (analysis) => set({ 
    analysis,
    totalSteps: analysis?.steps?.length || 0,
    currentStep: 0,
    visualizationType: analysis?.visualizationType || 'generic'
  }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error }),
  setCurrentStep: (updater) => set((state) => ({
    currentStep: typeof updater === 'function' ? updater(state.currentStep) : updater
  })),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setSelectedAlgorithm: (selectedAlgorithm) => set({ selectedAlgorithm }),
  toggleELI5: () => set((s) => ({ eli5Mode: !s.eli5Mode })),
  setExplanation: (explanation) => set({ explanation }),
  toggleAIPanel: () => set((s) => ({ showAIPanel: !s.showAIPanel })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  
  nextStep: () => set((s) => ({ 
    currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1) 
  })),
  prevStep: () => set((s) => ({ 
    currentStep: Math.max(s.currentStep - 1, 0) 
  })),
  reset: () => set({
    currentStep: 0,
    isPlaying: false,
    analysis: null,
    error: null,
    explanation: ''
  })
}));
