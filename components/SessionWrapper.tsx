"use client";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import React from 'react';

const SessionWrapper: React.FC<SessionProviderProps> = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

export default SessionWrapper;
