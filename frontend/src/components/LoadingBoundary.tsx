import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const LoadingBoundary: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default LoadingBoundary;
