import { create } from 'zustand';

interface ModalsStorage {
    isCreatePlaylistModalShown: boolean;
    isAddToPlaylistModalShown: boolean;

    toggleCreatePlaylistModal: (isOpen: boolean) => void;
    toggleAddToPlaylistModalShown: (isOpen: boolean) => void;
}

export const useModals = create<ModalsStorage>()(
    (set) => ({
        isCreatePlaylistModalShown: false,
        isAddToPlaylistModalShown: false,

        toggleCreatePlaylistModal: (isOpen) => {
            set({ isCreatePlaylistModalShown: isOpen })
        },

        toggleAddToPlaylistModalShown: (isOpen) => {
            set({ isAddToPlaylistModalShown: isOpen })
        }
    })
);
