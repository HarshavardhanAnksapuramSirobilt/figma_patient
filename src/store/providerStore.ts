import { create } from "zustand";
import type { 
  Provider, 
  ProviderFilters,
  ProviderStats,
  ProviderProfile,
  ProviderAvailability,
  WorkingHours
} from "../types/provider";

interface ProviderState {
  // Provider data
  providers: Provider[];
  currentProvider: Provider | null;
  providerProfiles: ProviderProfile[];
  providerStats: ProviderStats | null;
  
  // Filters and pagination
  filters: ProviderFilters;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  
  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  
  // Schedule and availability
  selectedProviderId: string | null;
  providerAvailability: Record<string, ProviderAvailability>; // date -> availability
  workingHours: WorkingHours[];
  
  // Actions
  setProviders: (providers: Provider[]) => void;
  setCurrentProvider: (provider: Provider | null) => void;
  setProviderProfiles: (profiles: ProviderProfile[]) => void;
  setProviderStats: (stats: ProviderStats) => void;
  setFilters: (filters: ProviderFilters) => void;
  setPagination: (totalPages: number, totalElements: number, currentPage: number) => void;
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setSelectedProviderId: (providerId: string | null) => void;
  setProviderAvailability: (date: string, availability: ProviderAvailability) => void;
  setWorkingHours: (hours: WorkingHours[]) => void;
  
  // Computed getters
  getActiveProviders: () => Provider[];
  getAvailableProviders: () => Provider[];
  getProvidersBySpecialization: (specialization: string) => Provider[];
  getProviderById: (id: string) => Provider | undefined;
  
  // Utility actions
  addProvider: (provider: Provider) => void;
  updateProvider: (providerId: string, updates: Partial<Provider>) => void;
  removeProvider: (providerId: string) => void;
  resetStore: () => void;
}

const initialState = {
  providers: [],
  currentProvider: null,
  providerProfiles: [],
  providerStats: null,
  filters: {
    page: 0,
    size: 20,
    isActive: true
  },
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  loading: false,
  creating: false,
  updating: false,
  selectedProviderId: null,
  providerAvailability: {},
  workingHours: []
};

export const useProviderStore = create<ProviderState>((set, get) => ({
  ...initialState,

  // Setters
  setProviders: (providers) => set({ providers }),
  
  setCurrentProvider: (provider) => set({ currentProvider: provider }),
  
  setProviderProfiles: (profiles) => set({ providerProfiles: profiles }),
  
  setProviderStats: (stats) => set({ providerStats: stats }),
  
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  
  setPagination: (totalPages, totalElements, currentPage) => 
    set({ totalPages, totalElements, currentPage }),
  
  setLoading: (loading) => set({ loading }),
  
  setCreating: (creating) => set({ creating }),
  
  setUpdating: (updating) => set({ updating }),
  
  setSelectedProviderId: (providerId) => set({ selectedProviderId: providerId }),
  
  setProviderAvailability: (date, availability) => 
    set(state => ({
      providerAvailability: {
        ...state.providerAvailability,
        [date]: availability
      }
    })),
  
  setWorkingHours: (hours) => set({ workingHours: hours }),

  // Computed getters
  getActiveProviders: () => {
    return get().providers.filter(provider => provider.isActive);
  },

  getAvailableProviders: () => {
    return get().providers.filter(provider => 
      provider.isActive && provider.status === 'Available'
    );
  },

  getProvidersBySpecialization: (specialization: string) => {
    return get().providers.filter(provider => 
      provider.specialization === specialization && provider.isActive
    );
  },

  getProviderById: (id: string) => {
    return get().providers.find(provider => provider.providerId === id);
  },

  // Utility actions
  addProvider: (provider) => {
    set(state => ({
      providers: [...state.providers, provider]
    }));
  },

  updateProvider: (providerId, updates) => {
    set(state => ({
      providers: state.providers.map(provider =>
        provider.providerId === providerId ? { ...provider, ...updates } : provider
      ),
      currentProvider: state.currentProvider?.providerId === providerId
        ? { ...state.currentProvider, ...updates }
        : state.currentProvider
    }));
  },

  removeProvider: (providerId) => {
    set(state => ({
      providers: state.providers.filter(provider => provider.providerId !== providerId),
      currentProvider: state.currentProvider?.providerId === providerId
        ? null
        : state.currentProvider
    }));
  },

  resetStore: () => set(initialState)
}));
