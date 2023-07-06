import { Unsubscribe } from "firebase/auth";
import { useEffect } from "react";

const useSubscriptions = () => {
  const subscriptions: Unsubscribe[] = [];

  const addSubscription = (sub: Unsubscribe) => {
    subscriptions.push(sub);
  };

  const unsubscribeAll = () => {
    subscriptions.forEach((unsubscribe, index) => {
      unsubscribe();
      subscriptions.splice(index, 1);
    });
  };

  useEffect(() => {
    return () => {
      console.log("Unsubscribing...");

      unsubscribeAll();
    };
  }, []);

  return [addSubscription];
};

export default useSubscriptions;
