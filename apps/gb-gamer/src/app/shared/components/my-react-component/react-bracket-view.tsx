import * as React from 'react';
import {FunctionComponent, useEffect, useRef, useState} from 'react';

import {createTheme, DoubleEliminationBracket, Match, SingleEliminationBracket} from "g-react-brackets";

export interface IMyComponentProps {
  counter: number;
  onClick?: () => void;
}

export interface IMatchProps {
  matches: any;
  onData: any;
}

const bracketContainer = {
  height: "100%",
  overflow: "auto",
};


export const SingleElimination: FunctionComponent<IMatchProps> = (props: IMatchProps) => {
  const navigateToMatchProfile = (data) => {
    if (data.match.home || data.match.away) {
      props.onData(data);
    } else {
      return
    }
  };
  return <div style={bracketContainer}>
    <SingleEliminationBracket
      onMatchClick={args => navigateToMatchProfile(args)}
      matches={props.matches}
      matchComponent={Match}
    />
  </div>;
};

export const DoubleElimination: FunctionComponent<IMatchProps> = (props: IMatchProps) => {
  const navigateToMatchProfile = (data) => {
    if (data.match.home || data.match.away) {
      props.onData(data);
    } else {
      return
    }
  };
  return <div style={bracketContainer}>
    <DoubleEliminationBracket
      onMatchClick={args => navigateToMatchProfile(args)}
      matches={props.matches}
      matchComponent={Match}
    />
  </div>;
};
