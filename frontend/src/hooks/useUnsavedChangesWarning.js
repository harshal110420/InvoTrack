import React from "react";
import { useEffect } from "react";
const useUnsavedChangesWarning = (unsavedChanges) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);
};

export default useUnsavedChangesWarning;
