import React, { useEffect } from "react";
import styles from "./index.scss";
import { useFetch } from "../../../hooks/useFetch";

const StatCard = ({ item }) => {
  const { loading, error, makeRequest, data } = useFetch();

  useEffect(() => {
    if (item) makeRequest(item.url);
  }, [item]);

  return (
    <div className={styles.card}>
      <div className={styles.title}>{item.title}</div>
      <p className={styles.stat}>{data?.entry?.length || 0}</p>
      {item.icon}
    </div>
  );
};

export default StatCard;
