import React from 'react';

export type Props<T> = {
  className?: string;
  children?: React.ReactNode;
} & T;

export type FComp<T = {}> = (props: Props<T>) => React.JSX.Element;

export type Settings = {
  client_id: string;
  client_secret: string;
  packet_id: string;
  code_verifier: string;
  token: string;
  refresh_token: string;
};
