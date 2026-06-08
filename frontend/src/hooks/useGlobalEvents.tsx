import { useEffect } from "react";

type EventListenerWithType<T extends keyof WindowEventMap> = (
  event: WindowEventMap[T],
) => void;

type Props = {
  [key in keyof WindowEventMap]?: EventListenerWithType<key>;
};
// type Props = {
//   [key in keyof WindowEventMap]?: EventListenerOrEventListenerObject;
// };

export default function useGlobalEvents(props: Props, deps?: any) {
  useEffect(
    () => {
      for (let [key, func] of Object.entries(props)) {
        window.addEventListener(key, func as EventListener, false);
      }
      return () => {
        for (let [key, func] of Object.entries(props)) {
          window.removeEventListener(key, func as EventListener, false);
        }
      };
    },
    deps === null ? undefined : deps ? deps : [],
  );
}
