import type { RefObject } from "react";
import useGlobalEvents from "./useGlobalEvents";

function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: Function,
  idsToAllow: string[] = [],
  idsToAllowOutsideParent: string[] = []
) {
  useGlobalEvents({
    mousedown: (event: MouseEvent) => {
      // stop propagation to prevent triggering the event when clicking inside the element
      if (ref.current && !ref.current.contains(event.target as any)) {
        for (let index = 0; index < idsToAllow.length; index++) {
          const id = idsToAllow[index];
          if (event.target !== null) {
            const parent = (event.target as any).closest("#" + id);
            if (parent) {
              return;
            }
          }
        }
        for (let index = 0; index < idsToAllowOutsideParent.length; index++) {
          const id = idsToAllowOutsideParent[index];
          if (event.target !== null) {
            const parent = (event.target as any).closest("#" + id);
            if (parent) {
              return;
            }
          }
        }
        handler();
      }
    },
  });
}

export default useClickOutside;
