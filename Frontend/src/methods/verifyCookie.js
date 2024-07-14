

import axios from "axios";

const verifyCookie = async (setUserName, setVerified) => {
  try {
    const { data } = await axios.post(
      "http://localhost:4000",
      {},
      { withCredentials: true }
    );

    console.log(data);

    if (data.status && data.user) {
      setUserName(data.user);
      setVerified(data.status);
    }
  } catch (err) {
    console.log(err);
  }
};

export default verifyCookie;
