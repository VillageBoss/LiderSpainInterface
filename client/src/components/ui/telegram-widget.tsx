import { useEffect, useRef } from "react";
import useTelegram from "@/hooks/useTelegram";

interface MainButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  progress?: boolean;
}

export function MainButton({ text, onClick, disabled = false, progress = false }: MainButtonProps) {
  const { webApp } = useTelegram();
  const callbackRef = useRef(onClick);

  useEffect(() => {
    callbackRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!webApp) return;

    // Set button text
    webApp.MainButton.setText(text);

    // Set click handler
    webApp.MainButton.onClick(() => callbackRef.current());

    // Show button
    webApp.MainButton.show();

    // Handle disabled state
    if (disabled) {
      webApp.MainButton.disable();
    } else {
      webApp.MainButton.enable();
    }

    // Handle progress state
    if (progress) {
      webApp.MainButton.showProgress(true);
    } else {
      webApp.MainButton.hideProgress();
    }

    // Cleanup
    return () => {
      webApp.MainButton.offClick(() => callbackRef.current());
      webApp.MainButton.hide();
    };
  }, [webApp, text, disabled, progress]);

  // This component doesn't render anything
  return null;
}

interface BackButtonProps {
  onClick: () => void;
  show: boolean;
}

export function BackButton({ onClick, show }: BackButtonProps) {
  const { webApp } = useTelegram();
  const callbackRef = useRef(onClick);

  useEffect(() => {
    callbackRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!webApp) return;

    // Set click handler
    webApp.BackButton.onClick(() => callbackRef.current());

    // Show/hide button
    if (show) {
      webApp.BackButton.show();
    } else {
      webApp.BackButton.hide();
    }

    // Cleanup
    return () => {
      webApp.BackButton.offClick(() => callbackRef.current());
      webApp.BackButton.hide();
    };
  }, [webApp, show]);

  // This component doesn't render anything
  return null;
}

export function useTelegramHaptic() {
  const { webApp } = useTelegram();

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

  return hapticFeedback;
}
