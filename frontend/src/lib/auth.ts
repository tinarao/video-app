import { queryOptions } from "@tanstack/react-query";
import { api } from "./rpc";

const getUserData = async () => {
    const res = await api.auth.me.$get();
    if (!res.ok) {
        localStorage.removeItem("username");
        throw new Error('Not authenticated');
    }
    const { user } = await res.json();
    localStorage.setItem("username", user.username);

    return user;
};

export const userQueryOpts = queryOptions({
    queryKey: ['user-data'],
    queryFn: getUserData,
    retry: false,
    staleTime: Infinity
});