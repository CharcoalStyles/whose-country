import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import LeafletMap from "../components/Map";
import { Splash } from "../components/Splash";
import "./Home.css";

const Home: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  return (
    <IonPage>
      <Splash onLoaded={() => setVisible(true)} />
      <LeafletMap visible={visible} onPoint={() => {}} />
    </IonPage>
  );
};

export default Home;
