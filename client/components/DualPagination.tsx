import React, { useRef, useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import FirstArrow from "@/svg/FirstArrow";
import LastArrow from "@/svg/LastArrow";
import NextArrow from "@/svg/NextArrow";
import PrevArrow from "@/svg/PrevArrow";
import { fetchPosts } from "@/services/posts";

interface paramsProps {
  date: number;
  topic: string;
  offset: number;
  limit: number;
}

interface ChildProps {
  filterHandle(data: Object): void;
}

interface Props {
  children(props: ChildProps): any;
  defaultProps: paramsProps;
  setRows(data: any): void;
}

const DualPagination: React.FC<Props> = ({
  children,
  defaultProps,
  setRows,
}) => {
  const [params, setParams] = useState<any>(
    typeof defaultProps === "object" ? defaultProps : {}
  );

  const prevParams = useRef<any>(
    typeof defaultProps === "object" ? defaultProps : {}
  );

  const fetchData = async () => {
    const request = await fetchPosts(
      defaultProps.date,
      defaultProps.topic,
      defaultProps.offset,
      defaultProps.limit
    );

    const body = await request.response;

    if (Array.isArray(body.posts)) {
      setRows(body.posts);
    }
  };

  const filterHandle = (data: any) => {
    const currentParams: any = JSON.parse(JSON.stringify(params));
    prevParams.current = JSON.parse(JSON.stringify(params));

    Object.keys(data).map((key: any) => {
      const value = data[key];

      if (value.length) {
        currentParams[key] = value;
      } else {
        delete currentParams[key];
      }
    });

    currentParams["offset"] = 0;

    setParams(currentParams);

    // console.log("currentParams", currentParams);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  return (
    <div>
      {children({ filterHandle })}

      <div>
        <Pagination
          count={10}
          renderItem={(item) => (
            <PaginationItem
              slots={{
                first: FirstArrow,
                previous: PrevArrow,
                next: NextArrow,
                last: LastArrow,
              }}
              {...item}
            />
          )}
        />
      </div>
    </div>
  );
};

export default DualPagination;
