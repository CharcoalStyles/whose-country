import React from "react";
import "./Splash.css";

type SplashProps = {
  onLoaded: () => void;
};

export const Splash = ({ onLoaded }: SplashProps) => {
  const [visible, setVisible] = React.useState(true);

  return visible ? (
    <div
      className="splash"
      onClick={() => {
        onLoaded();
        setVisible(false);
      }}
    >
      <div className="content">
        <h1>Whose Country?</h1>
        <p>
          This app aims to show the traditional territories of Aboriginal and
          Torres Straight Islanders.
        </p>
        <p>
          The data presented does not represent or intend to represent official
          or legal boundaries of any Indigenous nations. To learn about
          definitive boundaries, contact the nations in question.
        </p>
      </div>
    </div>
  ) : null;
};
