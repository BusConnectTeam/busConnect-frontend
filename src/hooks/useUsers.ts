import { usersApi, ApiException } from '@/lib/api';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const USERS_KEY = ['users'];

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: usersApi.getAll,
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: [...USERS_KEY, id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useUserByEmail(email: string) {
  return useQuery({
    queryKey: [...USERS_KEY, 'email', email],
    queryFn: () => usersApi.getByEmail(email),
    enabled: !!email,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      usersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      queryClient.invalidateQueries({ queryKey: [...USERS_KEY, variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}

export function useDeleteUserPermanent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.deletePermanent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}
