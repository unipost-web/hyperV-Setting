// configStore.ts
import create from 'zustand';

interface ConfigState {
  configData: Record<string, any>; // configData의 타입을 명확히 정의
  setConfigData: (params: Partial<Record<string, any>>) => void; // params의 타입을 명확히 정의
}

export const useConfigStore = create<ConfigState>((set) => ({
  configData: {},
  setConfigData: (params) =>
    set((state) => ({
      configData: { ...state.configData, ...params }, // 기존 상태를 유지하면서 새 데이터로 업데이트
    })),
}));
