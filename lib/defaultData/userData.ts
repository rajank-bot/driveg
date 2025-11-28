import type { User } from "../store/slices/userSlice";

export const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    storageUsed: 5242880,
    storageLimit: 15728640,
    plan: "free",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    storageUsed: 1073741824,
    storageLimit: 107374182400,
    plan: "basic",
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    storageUsed: 53687091200,
    storageLimit: 1073741824000,
    plan: "premium",
  },
];

export const getDefaultUser = (): User => {
  return defaultUsers[0];
};

