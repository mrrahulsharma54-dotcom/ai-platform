-- =========================================================
-- Boxput AI Website Builder - Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    business_type TEXT DEFAULT 'General',
    slug TEXT NOT NULL UNIQUE,
    website_config JSONB NOT NULL,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);

-- 2. Project Versions Table (Version History)
CREATE TABLE IF NOT EXISTS public.project_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    website_config JSONB NOT NULL,
    prompt_note TEXT DEFAULT 'Snapshot',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON public.project_versions(project_id);

-- 3. Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published websites by slug
CREATE POLICY "Public websites are viewable by everyone" 
ON public.projects FOR SELECT 
USING (published = true);

-- Allow authenticated users to view their own projects
CREATE POLICY "Users can view their own projects" 
ON public.projects FOR SELECT 
USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- Allow users to insert their own projects
CREATE POLICY "Users can create their own projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid()::text = user_id OR user_id IS NOT NULL);

-- Allow users to update their own projects
CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE 
USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- Allow users to delete their own projects
CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE 
USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- Policies for project_versions
CREATE POLICY "Users can manage versions of their projects" 
ON public.project_versions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE public.projects.id = public.project_versions.project_id 
    AND (public.projects.user_id = auth.uid()::text OR public.projects.user_id IS NOT NULL)
  )
);

-- =========================================================
-- Ready! Tables and security rules are configured.
-- =========================================================
