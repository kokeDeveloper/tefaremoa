export type PlanStatus = "EXPIRED" | "EXPIRING_SOON" | "ACTIVE" | "NO_PLAN";

export interface PlanAlertInfo {
  status: PlanStatus;
  daysRemaining: number | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Calculates the plan status using the end date and a configurable threshold for "expiring soon".
 */
export function calculatePlanAlert(
  planEndDate: Date | string | null | undefined,
  options: { expiringSoonThresholdDays?: number } = {}
): PlanAlertInfo {
  const { expiringSoonThresholdDays = 7 } = options;

  if (!planEndDate) {
    return {
      status: "NO_PLAN",
      daysRemaining: null,
      isExpired: false,
      isExpiringSoon: false,
    };
  }

  const endDate = planEndDate instanceof Date ? planEndDate : new Date(planEndDate);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / MS_PER_DAY);

  if (daysRemaining < 0) {
    return {
      status: "EXPIRED",
      daysRemaining,
      isExpired: true,
      isExpiringSoon: false,
    };
  }

  if (daysRemaining <= expiringSoonThresholdDays) {
    return {
      status: "EXPIRING_SOON",
      daysRemaining,
      isExpired: false,
      isExpiringSoon: true,
    };
  }

  return {
    status: "ACTIVE",
    daysRemaining,
    isExpired: false,
    isExpiringSoon: false,
  };
}

export function shouldIncludeInAlerts(info: PlanAlertInfo) {
  return info.status === "EXPIRED" || info.status === "EXPIRING_SOON";
}
