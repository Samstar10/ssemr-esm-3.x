import { openmrsFetch } from "@openmrs/esm-framework";
import React, { useState } from "react";
import {
  getThisQuartersRange,
  getThisYearsFirstAndLastDate,
} from "../helpers/dateOps";
import Link from "@carbon/react/lib/components/UIShell/Link";
import { TableCell, Tag } from "@carbon/react";
import { activeClientData } from "../dummy/data";

export const useChartData = () => {
  const filterOptions = [
    {
      name: "Year",
      value: "groupYear",
    },
    {
      name: "Month",
      value: "groupMonth",
    },
    {
      name: "Week",
      value: "groupWeek",
    },
  ];

  const [currentTopFilterIndex, setCurrentTopFilterIndex] = useState(0);

  const [filters, setFilters] = useState(filterOptions[0].value);

  const [time, setTime] = useState({
    startDate: getThisYearsFirstAndLastDate(new Date().getFullYear()).startDate,
    endDate: getThisYearsFirstAndLastDate(new Date().getFullYear()).endDate,
  });

  const [waterFallDateRange, setWaterFallDateRange] = useState({
    start: getThisQuartersRange().start,
    end: getThisQuartersRange().end,
  });

  const [viralLoadRange, setViralLoadRange] = useState({
    start: getThisYearsFirstAndLastDate(new Date().getFullYear()).startDate,
    end: getThisYearsFirstAndLastDate(new Date().getFullYear()).endDate,
  });

  const [chartData, setChartData] = useState({
    activeClients: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    allClients: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    newlyEnrolledClients: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    onAppointment: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    missedAppointment: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    interrupted: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    returned: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    dueForViralLoad: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    adultART: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    childART: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    viralLoadSamples: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    viralLoadResults: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    highViralLoad: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    underCareOfCommunityProgram: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    viralLoadCoverage: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    viralLoadSuppression: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    highViralLoadCascade: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
    waterfall: {
      raw: null,
      processedChartData: [],
      loading: false,
    },
  });

  const [currentTimeFilter, setCurrentTimeFilter] = useState(
    filterOptions[0].value
  );

  const [currentPaginationState, setCurrentPaginationState] = useState({
    page: 0,
    size: 15,
  });

  const getChartData = async ({
    url,
    responseCallback,
    errorCallBack,
    chartKey,
    append = false,
  }) => {
    try {
      setChartData((prev) => {
        const obj = {
          ...prev,
        };
        obj[chartKey] = {
          ...prev[chartKey],
          loading: true,
        };

        return obj;
      });

      const response = await openmrsFetch(`${url}&page=${currentPaginationState.page}&size=${currentPaginationState.size}`);
      const data = response?.data;

      if (data && data.results && data.results.length > 0) {
        responseCallback(data, append);

        setCurrentPaginationState((prev) => ({
          ...prev,
          page: prev.page + 1,
        }))

        if (data.results.length === currentPaginationState.size) {
          getChartData({
            url,
            responseCallback,
            errorCallBack,
            chartKey,
            append: true,
          });
        }
      } else {
        setChartData((prev) => ({
          ...prev,
          [chartKey]: {
            ...prev[chartKey],
            loading: false,
          },
        }));
      }
    } catch (error) {
      errorCallBack(error);
    } finally {
      setChartData((prev) => {
        const obj = {
          ...prev,
        };

        obj[chartKey] = {
          ...prev[chartKey],
          loading: false,
        };

        return obj;
      });
    }
  };

  const formatViralLoadData = (data) => {
    const processedData = data?.summary?.groupYear?.map((item) => {
      const keys = Object.keys(item);
      return {
        value: item[keys[0]],
        group: keys[0],
      };
    });
    return processedData;
  };

  const formatDataAgainstTime = (data) => {
    let bottomAxesArray = [];
  
    // Determine if we are working with a summary object or direct data
    if (data?.summary && data?.summary[currentTimeFilter]) {
      bottomAxesArray = Object.keys(data.summary[currentTimeFilter]);
    } else if (data[currentTimeFilter]) {
      bottomAxesArray = Object.keys(data[currentTimeFilter]);
    }
  
    // Map the keys to create the formatted data array
    const formattedData = bottomAxesArray.map((item) => {
      const returnObject = {};
      returnObject[currentTimeFilter] = item;
  
      let clients;
      if (data?.summary && data?.summary[currentTimeFilter]) {
        clients = data.summary[currentTimeFilter][item];
      } else if (data[currentTimeFilter]) {
        clients = data[currentTimeFilter][item];
      } else {
        clients = []; // Default to an empty array if data is not available
      }
      
      returnObject["clients"] = clients;
      return returnObject;
    });
  
    return formattedData;
  };

  const formatWaterfallData = (data) => {
    const TX_CURR = data.find((item) => Object.keys(item).includes("TX_CURR"))[
      "TX_CURR"
    ];

    const transferIn = data.find((item) =>
      Object.keys(item).includes("Transfer In")
    )["Transfer In"];

    const TX_NEW = data.find((item) => Object.keys(item).includes("TX_NEW"))[
      "TX_NEW"
    ];

    const TX_RTT = data.find((item) => Object.keys(item).includes("TX_RTT"))[
      "TX_RTT"
    ];

    const potentialTXCurr = data.find((item) =>
      Object.keys(item).includes("Potential TX_CURR")
    )["Potential TX_CURR"];

    const transferOut = data.find((item) =>
      Object.keys(item).includes("Transfer Out")
    )["Transfer Out"];

    const TX_DEATH = data.find((item) =>
      Object.keys(item).includes("TX_DEATH")
    )["TX_DEATH"];

    const selfTransfer = data.find((item) =>
      Object.keys(item).includes("TX_ML_Self Transfer")
    )["TX_ML_Self Transfer"];

    const refusal = data.find((item) =>
      Object.keys(item).includes("TX_ML_Refusal/Stopped")
    )["TX_ML_Refusal/Stopped"];

    const onARTLessThanThree = data.find((item) =>
      Object.keys(item).includes("TX_ML_IIT (<3 mo)")
    )["TX_ML_IIT (<3 mo)"];

    const onARTMoreThanThree = data.find((item) =>
      Object.keys(item).includes("TX_ML_IIT (3+ mo)")
    )["TX_ML_IIT (3+ mo)"];

    const calculated = data.find((item) =>
      Object.keys(item).includes("CALCULATED TX_CURR")
    )["CALCULATED TX_CURR"];

    const processed = [
      {
        group: "TX_CURR",
        value: [0, TX_CURR],
      },
      {
        group: "Transfer In",
        value: [TX_CURR, transferIn + TX_CURR],
      },
      {
        group: "TX_NEW",
        value: [transferIn + TX_CURR, transferIn + TX_CURR + TX_NEW],
      },
      {
        group: "TX_RTT",
        value: [
          transferIn + TX_CURR + TX_NEW,
          transferIn + TX_CURR + TX_NEW + TX_RTT,
        ],
      },
      {
        group: "Potential TX_CURR",
        value: [0, potentialTXCurr],
      },
      {
        group: "Transfer Out",
        value: [potentialTXCurr - transferOut, potentialTXCurr],
      },
      {
        group: "TX_DEATH",
        value: [
          potentialTXCurr - transferOut - TX_DEATH,
          potentialTXCurr - transferOut,
        ],
      },
      {
        group: "TX_ML_Self Transfer",
        value: [
          potentialTXCurr - transferOut - TX_DEATH - selfTransfer,
          potentialTXCurr - transferOut - TX_DEATH,
        ],
      },
      {
        group: "TX_ML_Refusal/Stopped",
        value: [
          potentialTXCurr - transferOut - TX_DEATH - selfTransfer - refusal,
          potentialTXCurr - transferOut - TX_DEATH - selfTransfer,
        ],
      },
      {
        group: "TX_ML_IIT (on ART <3 mo)",
        value: [
          potentialTXCurr -
            transferOut -
            TX_DEATH -
            selfTransfer -
            refusal -
            onARTLessThanThree,
          potentialTXCurr - transferOut - TX_DEATH - selfTransfer - refusal,
        ],
      },
      {
        group: "TX_ML_IIT (on ART 3+ mo)",
        value: [
          potentialTXCurr -
            transferOut -
            TX_DEATH -
            selfTransfer -
            refusal -
            onARTLessThanThree -
            onARTMoreThanThree,
          potentialTXCurr -
            transferOut -
            TX_DEATH -
            selfTransfer -
            refusal -
            onARTLessThanThree,
        ],
      },
      {
        group: "Calculated",
        value: [0, calculated],
      },
    ];

    return processed;
  };

  /**
   * AJAX requests defined here to avoid repeating them in individual components
   */
  const getActiveClients = () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/activeClients?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) => {
        setChartData((prev) => ({
          ...prev,
          activeClients: {
            ...prev.activeClients,
            raw: append
            ? Array.isArray(prev.activeClients.raw) && Array.isArray(data?.results) 
              ? [...(prev.activeClients.raw || []), ...(data.results || [])]
              : prev.activeClients.raw || []
            : Array.isArray(data?.results) 
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.activeClients.raw) ? prev.activeClients.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        }))
      },
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "activeClients",
      append: false
    });

  const getAllClients = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/allClients?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          allClients: {
            ...prev.allClients,
            raw: append 
            ? Array.isArray(prev.allClients.raw) && Array.isArray(data?.results) 
              ? [...(prev.allClients.raw || []), ...(data.results || [])]
              : prev.allClients.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.allClients.raw) ? prev.allClients.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error(error),
      chartKey: "allClients",
      append: false
    });

  const getNewlyEnrolledClients = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/newClients?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) => {
        setChartData((prev) => ({
          ...prev,
          newlyEnrolledClients: {
            ...prev.newlyEnrolledClients,
            raw: append
            ? Array.isArray(prev.newlyEnrolledClients.raw) && Array.isArray(data?.results)
              ? [...(prev.newlyEnrolledClients.raw || []), ...(data.results || [])]
              : prev.newlyEnrolledClients.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.newlyEnrolledClients.raw) ? prev.newlyEnrolledClients.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        }))},
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "newlyEnrolledClients",
      append: false
    });

  const getClientsOnAppointment = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/onAppointment?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          onAppointment: {
            ...prev.onAppointment,
            raw: append 
            ? Array.isArray(prev.onAppointment.raw) && Array.isArray(data?.results)
              ? [...(prev.onAppointment.raw || []), ...(data.results || [])]
              : prev.onAppointment.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.onAppointment.raw) ? prev.onAppointment.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "onAppointment",
      append: false
    });

  const getMissedAppointments = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/missedAppointment?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          missedAppointment: {
            ...prev.missedAppointment,
            raw: append
            ? Array.isArray(prev.missedAppointment.raw) && Array.isArray(data?.results)
              ? [...(prev.missedAppointment.raw || []), ...(data.results || [])]
              : prev.missedAppointment.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.missedAppointment.raw) ? prev.missedAppointment.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "missedAppointment",
      append: false
    });

  const getInterruptedTreatment = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/interruptedInTreatment?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          interrupted: {
            ...prev.interrupted,
            raw: append
            ? Array.isArray(prev.interrupted.raw) && Array.isArray(data?.results)
              ? [...(prev.interrupted.raw || []), ...(data.results || [])]
              : prev.interrupted.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.interrupted.raw) ? prev.interrupted.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "interrupted",
      append: false
    });

  const getReturnedToTreatment = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/returnedToTreatment?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          returned: {
            ...prev.returned,
            raw: append
            ? Array.isArray(prev.returned.raw) && Array.isArray(data?.results)
              ? [...(prev.returned.raw || []), ...(data.results || [])]
              : prev.returned.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.returned.raw) ? prev.returned.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "returned",
      append: false
    });

  const getDueForViralLoad = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/dueForVl?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          dueForViralLoad: {
            ...prev.dueForViralLoad,
            raw: append
            ? Array.isArray(prev.dueForViralLoad.raw) && Array.isArray(data?.results)
              ? [...(prev.dueForViralLoad.raw || []), ...(data.results || [])]
              : prev.dueForViralLoad.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.dueForViralLoad.raw) ? prev.dueForViralLoad.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "dueForViralLoad",
      append: false
    });

  const getViralLoadSamples = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/viralLoadSamplesCollected?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          viralLoadSamples: {
            ...prev.viralLoadSamples,
            raw: append
            ? Array.isArray(prev.viralLoadSamples.raw) && Array.isArray(data?.results)
              ? [...(prev.viralLoadSamples.raw || []), ...(data.results || [])]
              : prev.viralLoadSamples.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.viralLoadSamples.raw) ? prev.viralLoadSamples.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "viralLoadSamples",
      append: false
    });

  const getViralLoadResults = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/viralLoadResults?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          viralLoadResults: {
            ...prev.viralLoadResults,
            raw: append
            ? Array.isArray(prev.viralLoadResults.raw) && Array.isArray(data?.results)
              ? [...(prev.viralLoadResults.raw || []), ...(data.results || [])]
              : prev.viralLoadResults.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.viralLoadResults.raw) ? prev.viralLoadResults.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "viralLoadResults",
      append: false
    });

  const getHighViralLoad = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/highVl?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          highViralLoad: {
            ...prev.highViralLoad,
            raw: append
            ? Array.isArray(prev.highViralLoad.raw) && Array.isArray(data?.results)
              ? [...(prev.highViralLoad.raw || []), ...(data.results || [])]
              : prev.highViralLoad.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.highViralLoad.raw) ? prev.highViralLoad.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "highViralLoad",
      append: false
    });

  const getHighViralLoadCascade = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/viralLoadCascade?startDate=${viralLoadRange.start}&endDate=${viralLoadRange.end}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          highViralLoadCascade: {
            ...prev.highViralLoadCascade,
            raw: append 
            ? Array.isArray(prev.highViralLoadCascade.raw) && Array.isArray(data?.results)
              ? [...(prev.highViralLoadCascade.raw || []), ...(data.results || [])]
              : prev.highViralLoadCascade.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: append
              ? [...(Array.isArray(prev.highViralLoadCascade.raw) ? prev.highViralLoadCascade.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
              : data?.results,
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "highViralLoadCascade",
      append: false
    });

  const getAdultART = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/adultRegimenTreatment?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          adultART: {
            ...prev.adultART,
            raw: append
            ? Array.isArray(prev.adultART.raw) && Array.isArray(data?.results)
              ? [...(prev.adultART.raw || []), ...(data.results || [])]
              : prev.adultART.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: append
              ? [...(Array.isArray(prev.adultART.raw) ? prev.adultART.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
              : data?.results,
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "adultART",
      append: false
    });

  const getChildART = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/childRegimenTreatment?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          childART: {
            ...prev.childART,
            raw: append
            ? Array.isArray(prev.childART.raw) && Array.isArray(data?.results)
              ? [...(prev.childART.raw || []), ...(data.results || [])]
              : prev.childART.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: append 
              ? [...(Array.isArray(prev.childART.raw) ? prev.childART.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
              : data?.results,
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "childART",
      append: false
    });

  const getUnderCareOfCommunityProgram = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/underCareOfCommunityProgrammes?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          underCareOfCommunityProgram: {
            ...prev.underCareOfCommunityProgram,
            raw: append
            ? Array.isArray(prev.underCareOfCommunityProgram.raw) && Array.isArray(data?.results)
              ? [...(prev.underCareOfCommunityProgram.raw || []), ...(data.results || [])]
              : prev.underCareOfCommunityProgram.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.underCareOfCommunityProgram.raw) ? prev.underCareOfCommunityProgram.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "underCareOfCommunityProgram",
      append: false
    });

  const getViralLoadCoverage = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/viralLoadCoverage?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          viralLoadCoverage: {
            ...prev.viralLoadCoverage,
            raw: append
            ? Array.isArray(prev.viralLoadCoverage.raw) && Array.isArray(data?.results)
              ? [...(prev.viralLoadCoverage.raw || []), ...(data.results || [])]
              : prev.viralLoadCoverage.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.viralLoadCoverage.raw) ? prev.viralLoadCoverage.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "viralLoadCoverage",
      append: false
    });

  const getViralLoadSuppression = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/viralLoadSuppression?startDate=${time.startDate}&endDate=${time.endDate}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          viralLoadSuppression: {
            ...prev.viralLoadSuppression,
            raw: append
            ? Array.isArray(prev.viralLoadSuppression.raw) && Array.isArray(data?.results)
              ? [...(prev.viralLoadSuppression.raw || []), ...(data.results || [])]
              : prev.viralLoadSuppression.raw || []
            : Array.isArray(data?.results)
              ? data
              : [],
            processedChartData: formatDataAgainstTime(
              append
                ? [...(Array.isArray(prev.viralLoadSuppression.raw) ? prev.viralLoadSuppression.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "viralLoadSuppression",
      append: false
    });

  const getWaterFallData = async () =>
    getChartData({
      url: `/ws/rest/v1/ssemr/dashboard/waterfallAnalysis?startDate=${waterFallDateRange.start}&endDate=${waterFallDateRange.end}`,
      responseCallback: (data, append) =>
        setChartData((prev) => ({
          ...prev,
          waterfall: {
            ...prev.waterfall,
            raw: append 
            ? Array.isArray(prev.waterfall.raw) && Array.isArray(data?.results)
              ? [...(prev.waterfall.raw || []), ...(data.results || [])]
              : prev.waterfall.raw || []
            : Array.isArray(data?.results)
              ? data?.results
              : [],
            processedChartData: formatWaterfallData(
              append
                ? [...(Array.isArray(prev.waterfall.raw) ? prev.waterfall.raw : []), ...(Array.isArray(data?.results) ? data.results : [])]
                : data?.results
            ),
          },
        })),
      errorCallBack: (error) => console.error("Error", error),
      chartKey: "waterfall",
      append: false
    });

  const getStat = (dataSet) => {
    const filteredSet = dataSet?.filter((item) =>
      filterTabs[currentTopFilterIndex].filterFunction(item)
    );

    return filteredSet?.length;
  };

  const filterTabs = [
    {
      index: 0,
      title: "All clients",
      filterFunction: (item) => item,
    },
    {
      index: 1,
      title: "Children and adolescent",
      filterFunction: (item) => item.childOrAdolescent,
    },
    {
      index: 2,
      title: "pregnant and Breastfeeding Women",
      filterFunction: (item) => item.pregnantAndBreastfeeding,
    },
  ];

  const filterStatData = (stat) => {
    return stat?.filter(filterTabs[currentTopFilterIndex].filterFunction);
  };

  const defaultStatHeaders = [
    {
      name: "Name",
      selector: "name",
      cell: (row) => (
        <TableCell>
          <Link
            href={`${window.getOpenmrsSpaBase()}patient/${
              row?.uuid
            }/chart/Patient%20Summary`}
          >
            {row.name}
          </Link>
        </TableCell>
      ),
    },
    {
      name: "Sex",
      selector: "sex",
    },
    {
      name: "Date enrolled",
      selector: "dateEnrolled",
    },
    {
      name: "Last refill date",
      selector: "lastRefillDate",
    },
    {
      name: "Contact",
      selector: "contact",
    },
    {
      name: "Village",
      selector: "village",
      cell: (row) => (
        <TableCell>
          <p className="">{row.address.split(",")[0].split(":")[1]}</p>
        </TableCell>
      ),
    },
    {
      name: "Landmark",
      selector: "landMark",
      cell: (row) => (
        <TableCell>
          <p className="">{row.address.split(",")[1].split(":")[1]}</p>
        </TableCell>
      ),
    },
  ];

  const txCURRHeaders = [
    ...defaultStatHeaders,
    {
      name: "Eligible for VL",
      selector: "dueForVl",
      cell: (row) => (
        <TableCell size="sm">
          <Tag size="md" type={`${row.dueForVl ? "green" : "red"}`}>
            {row?.dueForVl ? "Eligible" : "Not eligible"}
          </Tag>
        </TableCell>
      ),
    },
  ];

  const stats = [
    {
      title: "Newly enrolled clients(TX_NEW)",
      color: "#3271F4",
      stat: getStat(chartData.newlyEnrolledClients?.raw?.results),
      results: filterStatData(chartData.newlyEnrolledClients?.raw?.results),
      loading: chartData.newlyEnrolledClients.loading,
      headers: defaultStatHeaders,
    },
    {
      title: "Active clients (TX_CURR)",
      color: "#3271F4",
      stat: getStat(chartData.activeClients?.raw?.results),
      results: filterStatData(chartData.activeClients?.raw?.results),
      loading: chartData.activeClients.loading,
      headers: txCURRHeaders,
    },
    {
      title: "On appointment",
      color: "#3271F4",
      stat: chartData.onAppointment?.raw?.results ? getStat(chartData.onAppointment?.raw?.results) : 0,
      results: filterStatData(chartData.onAppointment?.raw?.results),
      loading: chartData.onAppointment.loading,
      headers: defaultStatHeaders,
    },
    {
      title: "Missed appointments",
      color: "#FF0000",
      stat: getStat(chartData.missedAppointment?.raw?.results),
      results: filterStatData(chartData.missedAppointment?.raw?.results),
      loading: chartData.missedAppointment.loading,
      headers: defaultStatHeaders,
    },
    {
      title: "Interruptions in Treatment(TX_IIT)",
      color: "#FF8503",
      stat: getStat(chartData.interrupted?.raw?.results),
      results: filterStatData(chartData.interrupted?.raw?.results),
      loading: chartData.interrupted.loading,
      headers: defaultStatHeaders,
    },
    {
      title: "Returned to Treatment(TX_RTT)",
      color: "#3271F4",
      stat: getStat(chartData.returned?.raw?.results),
      results: filterStatData(chartData.returned?.raw?.results),
      loading: chartData.returned.loading,
      headers: defaultStatHeaders,
    },
    {
      title: "Due for viral load",
      color: "#FF8503",
      stat: chartData.dueForViralLoad?.raw?.results ? getStat(chartData.dueForViralLoad?.raw?.results) : 0,
      results: filterStatData(chartData.dueForViralLoad?.raw?.results),
      loading: chartData.dueForViralLoad.loading,
      headers: defaultStatHeaders,
    },
    {
      title: "High viral load (>= 1000 copies/ml)",
      color: "#FF0000",
      stat: chartData.highViralLoad?.raw?.results ? getStat(chartData.highViralLoad?.raw?.results) : 0,
      results: filterStatData(chartData.highViralLoad?.raw?.results),
      loading: chartData.highViralLoad.loading,
      headers: defaultStatHeaders,
    },
  ];

  return {
    getChartData,
    formatViralLoadData,
    setChartData,
    chartData,
    setCurrentTimeFilter,
    currentTimeFilter,
    time,
    setTime,
    currentTopFilterIndex,
    setCurrentTopFilterIndex,
    filters,
    setFilters,
    formatDataAgainstTime,
    getActiveClients,
    getStat,
    getAllClients,
    getNewlyEnrolledClients,
    getClientsOnAppointment,
    getMissedAppointments,
    getInterruptedTreatment,
    getReturnedToTreatment,
    getDueForViralLoad,
    getViralLoadResults,
    getViralLoadSamples,
    getHighViralLoad,
    getAdultART,
    getChildART,
    stats,
    filterTabs,
    getUnderCareOfCommunityProgram,
    getViralLoadCoverage,
    getViralLoadSuppression,
    getHighViralLoadCascade,
    waterFallDateRange,
    setWaterFallDateRange,
    viralLoadRange,
    setViralLoadRange,
    getWaterFallData,
    defaultStatHeaders,
    txCURRHeaders,
  };
};
