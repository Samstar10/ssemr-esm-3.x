import { formatDataAgainstTime } from "./formatDataAgainstTime";
import { formatWaterfallData } from "./formatWaterfallData";

export const chartRequestConfig = {
  allClients: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/allClients?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: formatDataAgainstTime,
    chartKey: "allClients",
    noPagination: false,
  },
  activeClients: {
    url: ({ time, categoryFilter }) =>
      `/ws/rest/v1/ssemr/dashboard/activeClients?startDate=${time.startDate}&endDate=${time.endDate}&filter=${categoryFilter}`,
    processor: formatDataAgainstTime,
    chartKey: "activeClients",
    noPagination: false,
  },
  newlyEnrolledClients: {
    url: ({ time, categoryFilter }) =>
      `/ws/rest/v1/ssemr/dashboard/newClients?startDate=${time.startDate}&endDate=${time.endDate}&filter=${categoryFilter}`,
    processor: formatDataAgainstTime,
    chartKey: "newlyEnrolledClients",
    noPagination: false,
  },
  onAppointment: {
    url: ({ time, categoryFilter }) =>
      `/ws/rest/v1/ssemr/dashboard/onAppointment?startDate=${time.startDate}&endDate=${time.endDate}&filter=${categoryFilter}`,
    processor: formatDataAgainstTime,
    chartKey: "onAppointment",
    noPagination: false,
  },
  missedAppointment: {
    url: ({ time, categoryFilter }) =>
      `/ws/rest/v1/ssemr/dashboard/missedAppointment?startDate=${time.startDate}&endDate=${time.endDate}&filter=${categoryFilter}`,
    processor: formatDataAgainstTime,
    chartKey: "missedAppointment",
    noPagination: false,
  },
  interrupted: {
    url: ({ time, categoryFilter }) =>
      `/ws/rest/v1/ssemr/dashboard/interruptedInTreatment?startDate=${time.startDate}&endDate=${time.endDate}&filter=${categoryFilter}`,
    processor: formatDataAgainstTime,
    chartKey: "interrupted",
    noPagination: false,
  },
  returned: {
    url: ({ time, categoryFilter }) =>
      `/ws/rest/v1/ssemr/dashboard/returnedToTreatment?startDate=${time.startDate}&endDate=${time.endDate}&filter=${categoryFilter}`,
    processor: formatDataAgainstTime,
    chartKey: "returned",
    noPagination: false,
  },
  dueForViralLoad: {
    url: ({ time, categoryFilter }) =>
      `/ws/rest/v1/ssemr/dashboard/dueForVl?startDate=${time.startDate}&endDate=${time.endDate}&filter=${categoryFilter}`,
    processor: formatDataAgainstTime,
    chartKey: "dueForViralLoad",
    noPagination: false,
  },
  viralLoadSamples: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/viralLoadSamplesCollected?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: formatDataAgainstTime,
    chartKey: "viralLoadSamples",
    noPagination: false,
  },
  viralLoadResults: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/viralLoadResults?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: formatDataAgainstTime,
    chartKey: "viralLoadResults",
    noPagination: false,
  },
  highViralLoad: {
    url: ({ time, categoryFilter }) =>
      `/ws/rest/v1/ssemr/dashboard/highVl?startDate=${time.startDate}&endDate=${time.endDate}&filter=${categoryFilter}`,
    processor: formatDataAgainstTime,
    chartKey: "highViralLoad",
    noPagination: false,
  },
  highViralLoadCascade: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/viralLoadCascade?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: (data) => data?.results,
    chartKey: "highViralLoadCascade",
    noPagination: true,
  },
  adultART: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/adultRegimenTreatment?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: (data) => data?.results,
    chartKey: "adultART",
    noPagination: true,
  },
  childART: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/childRegimenTreatment?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: (data) => data?.results,
    chartKey: "childART",
    noPagination: true,
  },
  underCareOfCommunityProgram: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/underCareOfCommunityProgrammes?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: formatDataAgainstTime,
    chartKey: "underCareOfCommunityProgram",
  },
  viralLoadCoverage: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/viralLoadCoverage?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: formatDataAgainstTime,
    chartKey: "viralLoadCoverage",
    noPagination: true,
  },
  viralLoadSuppression: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/viralLoadSuppression?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: formatDataAgainstTime,
    chartKey: "viralLoadSuppression",
    noPagination: true,
  },
  waterfall: {
    url: ({ time }) =>
      `/ws/rest/v1/ssemr/dashboard/waterfallAnalysis?startDate=${time.startDate}&endDate=${time.endDate}`,
    processor: formatWaterfallData,
    chartKey: "waterfall",
    noPagination: true,
  },
};
