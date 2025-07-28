import React from "react";
import { useEffect, useRef } from "react";

function InfiniteScroll({ children, fetchMore, hasNextPage }) {
  // useRef is used to create a reference to the loader element
  // This reference will be used to observe when the loader element comes into view
  const loader = useRef(null);

  useEffect(() => {
    const elementRef = loader.current;
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchMore();
      }
    });

    if (elementRef) observer.observe(elementRef);

    return () => observer.unobserve(elementRef);
  }, [fetchMore, hasNextPage]);

  return (
    <>
      {children}
      <div ref={loader} className="h-2"></div>
    </>
  );
}

export default InfiniteScroll;
