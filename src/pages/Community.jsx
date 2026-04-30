import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp, MessageSquare, ExternalLink, Plus, Share2, Users, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Community = () => {
  const [newResource, setNewResource] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => api.get('/resource').then(res => res.data),
  });

  const addMutation = useMutation({
    mutationFn: (title) => api.post('/resource', { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setNewResource('');
    }
  });

  const upvoteMutation = useMutation({
    mutationFn: (id) => api.post('/upvote', { resource_id: id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['resources'] });
      const previousResources = queryClient.getQueryData(['resources']);
      
      queryClient.setQueryData(['resources'], old => 
        old.map(res => res.id === id ? { ...res, upvotes: res.upvotes + 1 } : res)
      );

      return { previousResources };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['resources'], context.previousResources);
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (newResource.trim()) {
      addMutation.mutate(newResource.trim());
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Users className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Global Network</span>
          </div>
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-6">
            Community <span className="text-primary underline decoration-emerald-100 decoration-8 underline-offset-8 italic">Intelligence</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Collaborate with thousands of builders. Share high-signal resources, discuss architectural patterns, and grow together.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-2xl px-6 py-6 border-primary/20 text-primary font-black">
            <Filter className="w-5 h-5 mr-2" /> Filter
          </Button>
          <Button className="btn-primary rounded-2xl px-8 py-6 font-black shadow-lg shadow-primary/20">
            <Share2 className="w-5 h-5 mr-2" /> Invite Friend
          </Button>
        </div>
      </section>

      {/* Share Box */}
      <section className="glass-card rounded-[3rem] p-10 bg-white/40 border-primary/5">
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
              <Plus className="w-6 h-6" />
            </div>
            <input 
              value={newResource}
              onChange={(e) => setNewResource(e.target.value)}
              placeholder="Paste a masterpiece URL or resource title..." 
              className="w-full bg-white border-2 border-primary/5 rounded-[2rem] py-5 pl-16 pr-6 text-lg font-bold text-slate-700 placeholder:text-slate-300 focus:border-primary/20 outline-none transition-all shadow-sm"
            />
          </div>
          <Button 
            type="submit" 
            disabled={addMutation.isPending || !newResource.trim()}
            className="btn-primary rounded-[2rem] px-12 py-5 text-lg font-black h-auto w-full md:w-auto shadow-xl shadow-primary/20"
          >
            {addMutation.isPending ? 'Sharing...' : 'Deploy Resource'}
          </Button>
        </form>
      </section>

      {/* Resources Grid */}
      <section className="grid gap-8">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-32 glass-card rounded-[2.5rem] animate-pulse bg-slate-200/50" />
          ))
        ) : (
          data?.map((resource) => (
            <div 
              key={resource.id} 
              className="glass-card group p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-transparent hover:border-primary/20 hover:shadow-[0_30px_60px_-15px_rgba(0,161,155,0.1)] transition-all duration-500"
            >
              <div className="flex items-center gap-8 flex-1">
                <div className="w-16 h-16 shrink-0 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-3">
                    {resource.title}
                    <a href="#" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5 text-slate-300 hover:text-primary" />
                    </a>
                  </h3>
                  <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> {resource.comments_count || 0} Discussions
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> Shared by {resource.creator_name || 'Anonymous'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-[2rem] border border-primary/5">
                <span className="text-2xl font-black text-primary px-2 min-w-[3rem] text-center">
                  {resource.upvotes}
                </span>
                <Button 
                  onClick={() => upvoteMutation.mutate(resource.id)}
                  className="w-14 h-14 rounded-full bg-white border-2 border-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <ThumbsUp className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
