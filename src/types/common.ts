import React from 'react';

export type Props<T> = {
  className?: string;
  children?: React.ReactNode;
} & T;

export type FComp<T = {}> = (props: Props<T>) => React.JSX.Element;
