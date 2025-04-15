import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import 'react-native-get-random-values';


export default function Index() {
  const [currentScreen, setCurrentScreen] = useState("splash");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScreen === "splash") {
        setCurrentScreen("welcome");
      } else if (currentScreen === "welcome") {
        setCurrentScreen("login");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  if (currentScreen === "splash") {
    return <Redirect href="/splash" />;
  }

  if (currentScreen === "welcome") {
    return <Redirect href="/splash/welcome" />;
  }

  return <Redirect href="/auth/login" />;
}
