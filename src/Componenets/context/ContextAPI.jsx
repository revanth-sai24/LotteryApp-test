import React, { useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const ContextProvider = React.createContext({
  userState: () => {},
  setUserState: () => {},
});

const ContextAPI = (props) => {
  const [userState, setUserState] = useState(false);

  const passedValues = useMemo(() => {
    return {
      userState,
      setUserState,
    };
  }, [userState]);
  return (
    <React.Fragment>
      <ContextProvider.Provider value={passedValues}>
        {props.children}
      </ContextProvider.Provider>
    </React.Fragment>
  );
};

export default ContextAPI;

//custom hook
export const useContextAPI = () => {
  return useContext(ContextProvider);
};

ContextAPI.propTypes = {
  children: PropTypes.any,
};
