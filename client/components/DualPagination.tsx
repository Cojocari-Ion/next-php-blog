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
  const [resultCount, setResultCount] = useState<number>(0);

  const fetchData = async () => {
    const request = await fetchPosts(
      params.date,
      params.topic,
      params.limit,
      params.offset
    );

    const body = await request.response;
    // console.log(body);

    if (Array.isArray(body.posts)) {
      setRows(body.posts);
    }

    if (body.post_count > 0) {
      setResultCount(body.post_count);
    }
  };

  const filterHandle = (data: any) => {
    const currentParams: any = JSON.parse(JSON.stringify(params));
    prevParams.current = JSON.parse(JSON.stringify(params));

    Object.keys(data).map((key: any) => {
      const value = data[key];

      if (value) {
        currentParams[key] = value;
      } else {
        delete currentParams[key];
      }
    });

    setParams(currentParams);
  };

  const handlePageChange = (e: any, selectedItem: any) => {
    let parsed: any = JSON.parse(JSON.stringify(params));

    parsed["offset"] = Math.ceil((selectedItem - 1) * 10);
    parsed["limit"] = Math.ceil(selectedItem * 10);

    setParams(parsed);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  return (
    <div>
      {children({ filterHandle })}

      <div>
        {resultCount > 10 && (
          <Pagination
            count={Math.ceil(resultCount / 10)}
            onChange={handlePageChange}
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
        )}
      </div>
    </div>
  );
};

export default DualPagination;
