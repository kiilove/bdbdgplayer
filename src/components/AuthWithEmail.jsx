import React, { useState } from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";

const AuthWithEmail = async (propEmail, propPwd) => {
  const { user, isLoading, error, signInWithEmail } = useFirebaseAuth();
  await signInWithEmail(propEmail, propPwd);
  return { user, isLoading, error };
};

export default AuthWithEmail;
