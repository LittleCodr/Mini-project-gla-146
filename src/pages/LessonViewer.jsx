import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Lightbulb, 
  Code2, 
  Home, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';

export const LessonViewer = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const roadmapSteps = location.state?.steps || [];
  const currentIndex = roadmapSteps.findIndex(s => s.title === title);
  
  const { data: lesson, isLoading, isError } = useQuery({
    queryKey: ['lesson', title],
    queryFn: async () => {
      const res = await api.learning.getLesson(title);
      return res.data;
    },
    enabled: !!title,
  });

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => api.progress.get().then(res => res.data),
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.auth.me().then(res => res.data),
    enabled: roadmapSteps.length === 0, // Only fetch if we lost state
  });

  const { data: fallbackPath } = useQuery({
    queryKey: ['path', profile?.current_interest],
    queryFn: () => api.learning.generatePath(profile?.current_interest).then(res => res.data.steps),
    enabled: !!profile?.current_interest && roadmapSteps.length === 0,
  });

  // Use state steps if available, otherwise use fallback from API
  const finalSteps = roadmapSteps.length > 0 ? roadmapSteps : (fallbackPath || []);
  const actualCurrentIndex = finalSteps.findIndex(s => s.title === title || s.title === decodeURIComponent(title));

  const completeMutation = useMutation({
    mutationFn: (stepTitle) => api.progress.update(stepTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  const isCompleted = progress?.completedItems?.some(item => item.step_title === title);

  const goToNext = () => {
    if (actualCurrentIndex < finalSteps.length - 1) {
      const nextStep = finalSteps[actualCurrentIndex + 1];
      navigate(`/lesson/${encodeURIComponent(nextStep.title)}`, { state: { steps: finalSteps } });
    }
  };

  const goToPrev = () => {
    if (actualCurrentIndex > 0) {
      const prevStep = finalSteps[actualCurrentIndex - 1];
      navigate(`/lesson/${encodeURIComponent(prevStep.title)}`, { state: { steps: finalSteps } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xl font-black text-primary animate-pulse">Syncing Neural Knowledge...</p>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="p-8 bg-red-50 text-red-500 rounded-[2rem] shadow-xl">
          <BookOpen className="w-16 h-16" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Transmission Interrupted</h2>
          <p className="text-xl text-slate-500 font-bold max-w-md mx-auto">We couldn't retrieve the curriculum for "{title}". The signal might be weak.</p>
        </div>
        <Button onClick={() => navigate('/learning-path')} className="btn-primary px-10 py-6 rounded-[1.5rem] font-black">
          Return to Neural Map
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] -m-8">
      {/* Sidebar - Pro Navigation */}
      <aside className="w-80 glass-card border-r border-primary/10 bg-white/40 backdrop-blur-2xl overflow-y-auto hidden lg:block sticky top-0 h-screen">
        <div className="p-10 border-b border-primary/10">
          <div className="flex items-center gap-4 text-primary font-black text-2xl tracking-tighter">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <span>LearnPath</span>
          </div>
        </div>
        <nav className="p-6 space-y-3">
          <p className="px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Current Trajectory
          </p>
          {finalSteps.length > 0 ? (
            finalSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/lesson/${encodeURIComponent(step.title)}`, { state: { steps: finalSteps } })}
                className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${
                  step.title === title || step.title === decodeURIComponent(title)
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                    : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <span className="opacity-40 mr-2">{(idx + 1).toString().padStart(2, '0')}</span>
                {step.title}
              </button>
            ))
          ) : (
             <button
              onClick={() => navigate('/learning-path')}
              className="w-full text-left px-5 py-4 rounded-2xl text-sm font-black text-primary bg-primary/5 hover:bg-primary/10 flex items-center gap-3 transition-all"
            >
              <Home className="w-5 h-5" /> Return to Map
             </button>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-transparent">
        {/* Navigation Header */}
        <header className="sticky top-0 z-20 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-primary/5 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/learning-path')}
              className="lg:hidden text-primary"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h2 className="text-xl font-black text-slate-800 tracking-tight truncate max-w-md">
              {lesson.title}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => completeMutation.mutate(title)}
              className={`rounded-2xl px-5 py-4 font-black transition-all ${
                isCompleted 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-400 hover:bg-emerald-50 hover:text-primary'
              }`}
            >
              <CheckCircle2 className={`w-6 h-6 ${isCompleted ? 'fill-current' : ''}`} />
            </Button>

            <Button 
              variant="outline" 
              onClick={goToPrev}
              disabled={actualCurrentIndex <= 0}
              className="rounded-2xl px-6 py-4 border-primary/10 text-primary font-black"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              onClick={goToNext}
              disabled={actualCurrentIndex >= finalSteps.length - 1 && finalSteps.length > 0}
              className="btn-primary rounded-2xl px-8 py-4 font-black shadow-lg shadow-primary/20"
            >
              <span className="hidden sm:inline">Continue</span>
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </header>

        {/* Lesson Content */}
        <div className="max-w-5xl mx-auto px-10 py-16 space-y-16">
          {/* Hero Section */}
          <section className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-50 text-primary border border-primary/10">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Lesson</span>
            </div>
            <h1 className="text-7xl font-black text-slate-800 leading-none tracking-tighter">
              {lesson.title}
            </h1>
            <div 
              className="text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: lesson.introduction.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-primary/5 text-primary px-2 py-0.5 rounded-lg font-black">$1</code>') }}
            />
          </section>

          {/* Sections */}
          {lesson?.sections?.map((section, idx) => (
            <section 
              key={idx}
              className="space-y-10"
            >
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-1 bg-primary/20 rounded-full transition-all group-hover:w-24 group-hover:bg-primary/40" />
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                  {section.heading}
                </h2>
              </div>
              
              {section.content && (
                <div 
                  className="text-xl text-slate-500 font-medium leading-relaxed max-w-4xl"
                  dangerouslySetInnerHTML={{ 
                    __html: section.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>')
                      .replace(/`(.*?)`/g, '<code class="bg-primary/5 text-primary px-2 py-0.5 rounded-lg font-black">$1</code>') 
                  }}
                />
              )}
              
              {section.code && (
                <div className="group relative rounded-[2.5rem] overflow-hidden border border-primary/10 bg-slate-900 shadow-2xl">
                  <div className="flex items-center justify-between px-8 py-4 bg-slate-950 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">
                        {section.language || 'Code Fragment'}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigator.clipboard.writeText(section.code);
                      }}
                      className="text-slate-400 hover:text-white font-black uppercase text-[10px] tracking-widest"
                    >
                      Copy Logic
                    </Button>
                  </div>
                  <pre className="p-10 overflow-x-auto text-lg leading-relaxed text-emerald-400 font-mono scrollbar-hide">
                    <code>{section.code}</code>
                  </pre>
                  

                </div>
              )}
            </section>
          ))}

          {/* Tip Card */}
          {lesson.tip && (
            <div className="glass-card rounded-[3.5rem] p-12 bg-emerald-50 border-primary/10 flex gap-8">
              <div className="shrink-0 w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                <Lightbulb className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-black text-primary uppercase tracking-tighter">Pro Insight</h4>
                <p className="text-xl text-slate-600 font-bold leading-relaxed">
                  {lesson.tip}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-20 border-t border-primary/5">
            <Button 
              variant="outline" 
              onClick={goToPrev}
              disabled={actualCurrentIndex <= 0}
              className="w-full sm:w-auto rounded-3xl px-10 py-8 text-lg font-black border-primary/10 text-primary"
            >
              <ChevronLeft className="w-6 h-6 mr-3" />
              Previous
            </Button>
            
            <div className="text-slate-400 font-black uppercase tracking-widest text-xs">
              {actualCurrentIndex >= 0 ? actualCurrentIndex + 1 : 0} of {finalSteps.length}
            </div>

            <Button 
              onClick={() => {
                completeMutation.mutate(title);
                goToNext();
              }}
              disabled={actualCurrentIndex >= finalSteps.length - 1 && finalSteps.length > 0}
              className="w-full sm:w-auto btn-primary rounded-3xl px-12 py-8 text-lg font-black shadow-2xl shadow-primary/20"
            >
              Next Milestone
              <ChevronRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
