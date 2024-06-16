import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SubscriptionsStorage {
    subscriptionIDs: number[];
    subscribe: (id: number) => void;
    unsubscribe: (id: number) => void;
}

export const useSubscriptions = create<SubscriptionsStorage>()(
    persist(
        (set, get) => ({
            subscriptionIDs: [],
            subscribe: (id) => {
                const old = get().subscriptionIDs;
                const newSubscriptions = [...old, id];
                set({ subscriptionIDs: newSubscriptions })
            },
            unsubscribe: (id) => {
                const old = get().subscriptionIDs;
                const newSubscriptions = old.filter(i => i !== id);
                set({ subscriptionIDs: newSubscriptions })
            },
        }),
        {
            name: 'subscriptions',
        },
    ),
);
