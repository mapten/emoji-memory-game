import { useShallow } from 'zustand/react/shallow';

import { selectLowEndReasons, usePerformanceStore } from '../store/performance.store';
import { LowEndReason } from '../utils/device.utils';

/** Whether this device is considered low-end, and why (see utils/device.utils.ts). */
export const useLowEndDevice = (): { isLowEnd: boolean; reasons: LowEndReason[] } => {
  const reasons = usePerformanceStore(useShallow((state) => selectLowEndReasons(state)));

  return { isLowEnd: reasons.length > 0, reasons };
};
