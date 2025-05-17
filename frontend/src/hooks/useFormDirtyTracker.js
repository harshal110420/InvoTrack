// hooks/useFormDirtyTracker.js
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const useFormDirtyTracker = (dependencies = []) => {
  const { setIsDirty } = useOutletContext();

  useEffect(() => {
    setIsDirty(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useFormDirtyTracker;
