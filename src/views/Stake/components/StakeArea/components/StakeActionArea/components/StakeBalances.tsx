import { t } from "@lingui/macro";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { DataRow } from "@olympusdao/component-library";
import { BigNumber, BigNumberish } from "ethers";
import { NetworkId } from "src/constants";
import { convertGohmToOhm, formatNumber, nonNullable, parseBigNumber } from "src/helpers";
import {
  // useFuseBalance,
  useGohmBalance,
  // useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  // useV1SohmBalance,
  // useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

const DECIMAL_PLACES_SHOWN = 4;

/*
const hasVisibleBalance = (balance?: BigNumber, units: BigNumberish = 9) =>
  balance && parseBigNumber(balance, units) > 9 / Math.pow(10, DECIMAL_PLACES_SHOWN + 1);
*/

const formatBalance = (balance?: BigNumber, units: BigNumberish = 9) =>
  balance && formatNumber(parseBigNumber(balance, units), DECIMAL_PLACES_SHOWN);

export const StakeBalances = () => {
  const ohmBalances = useOhmBalance();
  const sohmBalances = useSohmBalance();
  const gohmBalances = useGohmBalance();
  // const wsohmBalances = useWsohmBalance();
  // const v1sohmBalances = useV1SohmBalance();
  // const gohmFuseBalances = useFuseBalance();
  // const gohmTokemakBalances = useGohmTokemakBalance();
  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();

  const sohmTokens = [sohmBalances[networks.POLYGON].data];
  const totalSohmBalance = sohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const gohmTokens = [
    // gohmBalances[networks.MAINNET].data,
    // gohmBalances[NetworkId.ARBITRUM].data,
    // gohmBalances[NetworkId.AVALANCHE].data,
    // gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.POLYGON_TESTNET].data,
    // gohmBalances[NetworkId.FANTOM].data,
    // wsohmBalances[NetworkId.MAINNET].data,
    // wsohmBalances[NetworkId.ARBITRUM].data,
    // wsohmBalances[NetworkId.AVALANCHE].data,
    // gohmFuseBalances[NetworkId.MAINNET].data,
    // gohmTokemakBalances[NetworkId.MAINNET].data,
  ];
  const totalGohmBalance = gohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const totalStakedBalance = currentIndex
    ? formatBalance(totalSohmBalance.mul(10 ** 9).add(convertGohmToOhm(totalGohmBalance, currentIndex)), 18)
    : BigNumber.from(0);

  const allBalancesLoaded = sohmTokens.every(Boolean) && gohmTokens.every(Boolean);

  return (
    <>
      <DataRow
        id="user-balance"
        title={t`Unstaked Balance`}
        isLoading={!ohmBalances[networks.POLYGON].data}
        balance={`${formatBalance(ohmBalances[networks.POLYGON].data)} OHM`}
      />

      <Accordion className="stake-accordion" square defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
          <DataRow
            id="user-staked-balance"
            isLoading={!allBalancesLoaded}
            title={t`Total Staked Balance`}
            balance={`${totalStakedBalance} sOHM`}
          />
        </AccordionSummary>

        <AccordionDetails>
          <DataRow
            indented
            title={t`sOHM`}
            id="user-staked-balance"
            isLoading={!sohmBalances[networks.POLYGON].data}
            balance={`${formatBalance(sohmBalances[networks.POLYGON].data)} sOHM`}
          />

          <DataRow
            indented
            title={t`gOHM`}
            isLoading={!gohmBalances[networks.POLYGON].data}
            balance={`${formatBalance(gohmBalances[networks.POLYGON].data, 18)} gOHM`}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};
