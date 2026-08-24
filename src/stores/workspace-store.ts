import { create } from 'zustand';
import type { WorkspaceTab, EditorMode, FilePath } from '@/lib/vault/types';

interface WorkspaceState {
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  activeLeftTab: 'files' | 'search' | 'tags';
  activeRightTab: 'backlinks' | 'outline' | 'properties';
  editorMode: EditorMode;
  splitDirection: 'horizontal' | 'vertical' | null;

  openTab: (filePath: FilePath) => void;
  closeTab: (tabId: string) => void;
  closeOtherTabs: (tabId: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (tabId: string) => void;
  pinTab: (tabId: string) => void;
  markUnsaved: (tabId: string) => void;
  markSaved: (tabId: string) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setActiveLeftTab: (tab: 'files' | 'search' | 'tags') => void;
  setActiveRightTab: (tab: 'backlinks' | 'outline' | 'properties') => void;
  setEditorMode: (mode: EditorMode) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  tabs: [],
  activeTabId: null,
  leftSidebarOpen: true,
  rightSidebarOpen: false,
  leftSidebarWidth: 260,
  rightSidebarWidth: 280,
  activeLeftTab: 'files',
  activeRightTab: 'backlinks',
  editorMode: 'live-preview',
  splitDirection: null,

  openTab: (filePath) => {
    const { tabs } = get();
    const existing = tabs.find(t => t.filePath === filePath);
    if (existing) {
      set({ activeTabId: existing.id });
    } else {
      const newTab: WorkspaceTab = {
        id: crypto.randomUUID(),
        filePath,
        isPinned: false,
        isUnsaved: false
      };
      set({ tabs: [...tabs, newTab], activeTabId: newTab.id });
    }
  },

  closeTab: (tabId) => {
    const { tabs, activeTabId } = get();
    const newTabs = tabs.filter(t => t.id !== tabId);
    let newActiveId = activeTabId;
    if (activeTabId === tabId) {
      newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
    }
    set({ tabs: newTabs, activeTabId: newActiveId });
  },

  closeOtherTabs: (tabId) => {
    const { tabs } = get();
    const tabToKeep = tabs.find(t => t.id === tabId);
    if (tabToKeep) {
      set({ tabs: [tabToKeep], activeTabId: tabId });
    }
  },

  closeAllTabs: () => set({ tabs: [], activeTabId: null }),

  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  pinTab: (tabId) => {
    const { tabs } = get();
    set({
      tabs: tabs.map(t => t.id === tabId ? { ...t, isPinned: !t.isPinned } : t)
    });
  },

  markUnsaved: (tabId) => {
    const { tabs } = get();
    set({
      tabs: tabs.map(t => t.id === tabId ? { ...t, isUnsaved: true } : t)
    });
  },

  markSaved: (tabId) => {
    const { tabs } = get();
    set({
      tabs: tabs.map(t => t.id === tabId ? { ...t, isUnsaved: false } : t)
    });
  },

  toggleLeftSidebar: () => set(state => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightSidebar: () => set(state => ({ rightSidebarOpen: !state.rightSidebarOpen })),
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
  setEditorMode: (mode) => set({ editorMode: mode }),
  
  reorderTabs: (fromIndex, toIndex) => {
    const { tabs } = get();
    const newTabs = [...tabs];
    const [moved] = newTabs.splice(fromIndex, 1);
    newTabs.splice(toIndex, 0, moved);
    set({ tabs: newTabs });
  }
}));
