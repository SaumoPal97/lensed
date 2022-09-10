import React, { useCallback, useMemo } from "react";
import {
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork,
  useSignMessage,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import Cookies from "js-cookie";
import {
  client,
  generateChallenge,
  authenticate,
  refreshToken,
} from "../../services/api/instance";
import jwtDecode from "jwt-decode";
import { useHistory } from "react-router-dom";

function Header() {
  const history = useHistory();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const COOKIE_CONFIG = {
    sameSite: "None",
    secure: true,
    expires: 360,
  };

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const refreshTokenCall = useCallback(async () => {
    const accessToken = Cookies.get("accessToken");
    const { exp } = jwtDecode(accessToken);

    if (Date.now() >= exp * 1000) {
      const refreshData = await client
        .mutation(refreshToken, {
          request: { refreshToken: Cookies.get("refreshToken") },
        })
        .toPromise();

      const refresh = refreshData?.data?.refresh;
      Cookies.set("accessToken", refresh?.accessToken, COOKIE_CONFIG);
      Cookies.set("refreshToken", refresh?.refreshToken, COOKIE_CONFIG);
    }
  }, [COOKIE_CONFIG]);

  const isLoggedIn = useMemo(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken === "undefined" || !accessToken) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return false;
    }

    const { exp } = jwtDecode(accessToken);

    if (Date.now() >= exp * 1000) {
      refreshTokenCall();
    }
    return true;
  }, [refreshTokenCall]);

  const { signMessageAsync, isLoading: signLoading } = useSignMessage({});

  const signInWithLens = async () => {
    const challenge = await client
      .query(generateChallenge, { request: { address } })
      .toPromise();

    const signature = await signMessageAsync({
      message: challenge?.data?.challenge?.text,
    });

    const auth = await client
      .mutation(authenticate, { request: { address, signature } })
      .toPromise();

    Cookies.set(
      "accessToken",
      auth.data.authenticate.accessToken,
      COOKIE_CONFIG
    );
    Cookies.set(
      "refreshToken",
      auth.data.authenticate.refreshToken,
      COOKIE_CONFIG
    );
  };

  return (
    <div className="flex flex-col justify-between pb-2 w-full">
      <div className="flex flex-row justify-between pb-8 w-full">
        <div className="font-bold text-3xl text-primary">LensEd</div>
        <div>
          <input
            style={{ width: "500px" }}
            type="text"
            placeholder="Search [Coming Soon]"
            className="border border-secondary rounded px-2 py-1"
          />
        </div>
        <div className="bg-tertiary px-2 py-1 rounded-md">
          {isConnected ? (
            chain?.id === 137 ? (
              isLoggedIn ? (
                <button onClick={() => history.push("/ask")}>
                  Ask a question
                </button>
              ) : (
                <button onClick={signInWithLens}>
                  Sign in With Lens
                  {signLoading && " (signing)"}
                </button>
              )
            ) : (
              <button onClick={() => switchNetwork?.(137)}>
                Switch to Polygon
                {isLoading && pendingChainId === 137 && " (switching)"}
                <div>{error && error.message}</div>
              </button>
            )
          ) : (
            <button onClick={connect}>Connect Wallet</button>
          )}
        </div>
      </div>
      <div className="pb-3">
        <h1 className="text-4xl font-bold pb-2">Welcome to LensEd 👋</h1>
        <p>
          LensEd is a decentralized and permissionless QnA platform built with
          Lens Protocol 🌿
        </p>
      </div>
    </div>
  );
}

export default Header;
