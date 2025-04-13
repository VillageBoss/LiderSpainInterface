import { useEffect, useState } from "react";

interface WebApp {
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    start_param?: string;
  };
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    setParams: (params: object) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  ready: () => void;
}

const useTelegram = () => {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [initData, setInitData] = useState<string | null>(null);
  const [user, setUser] = useState<WebApp["initDataUnsafe"]["user"] | null>(null);

  useEffect(() => {
    //@ts-ignore
    const tgWebApp = window.Telegram?.WebApp;
    
    if (tgWebApp) {
      setWebApp(tgWebApp);
      setInitData(tgWebApp.initData);
      setUser(tgWebApp.initDataUnsafe?.user || null);
      
      // Tell Telegram WebApp that we are ready to work with it
      tgWebApp.ready();
    }
  }, []);

  const showMainButton = (text: string, onClick: () => void) => {
    if (!webApp) return;
    
    webApp.MainButton.setText(text);
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();
  };

  const hideMainButton = () => {
    if (!webApp) return;
    webApp.MainButton.hide();
  };

  const showBackButton = () => {
    if (!webApp) return;
    webApp.BackButton.show();
  };

  const hideBackButton = () => {
    if (!webApp) return;
    webApp.BackButton.hide();
  };

  const hapticFeedback = {
    impact: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => {
      webApp?.HapticFeedback.impactOccurred(style);
    },
    notification: (type: "error" | "success" | "warning") => {
      webApp?.HapticFeedback.notificationOccurred(type);
    },
    selectionChanged: () => {
      webApp?.HapticFeedback.selectionChanged();
    }
  };

  return {
    webApp,
    initData,
    user,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback
  };
};

export default useTelegram;
