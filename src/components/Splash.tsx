import React from "react";
import { useEffect } from "react";
import "./Splash.css";

type SplashProps = {
  onLoaded: () => void;
};

export const Splash = ({ onLoaded }: SplashProps) => {
  const [visible, setVisible] = React.useState(true);
  useEffect(() => {
    console.log("Splash");
    setTimeout(() => {
      console.log("Splash loaded");
      setVisible(false);
      onLoaded();
    }, 1000);
  }, [onLoaded]);

  return visible ? (
    <div className="splash">
      <h1>Hi</h1>
    </div>
  ) : null;
};
