import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'; // 引入持久化中间件

const useTokenStore = create(
  persist(
    (set) => ({
      token: "dfefgeg",
      updateToken: (newToken: string) => {
        set({ token: newToken });
      },
      clearToken: () => {
        set({ token: "" }); // 新增方法，用于退出登录时清空 token
      },
    }),
    {
      name: 'auth-storage', // 存储到 localStorage 的键名
      storage: createJSONStorage(() => localStorage), // 明确使用 localStorage
    }
  )
);

export default useTokenStore;