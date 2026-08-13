// ============================================================================
// USE NAVIGATION HOOK
// ============================================================================
// Navigation helper hook using React Router

import { useNavigate as useReactRouterNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/store';

export function useNavigation() {
  const navigate = useReactRouterNavigate();
  const { setCurrentPath, addToHistory } = useNavigationStore();

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    addToHistory(path);
    navigate(path);
  };

  const goBack = () => {
    const { goBack: storeGoBack } = useNavigationStore.getState();
    storeGoBack();
    navigate(-1);
  };

  return {
    navigateTo,
    goBack,
  };
}
