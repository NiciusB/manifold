import { Bet } from 'common/bet'
import { Contract } from 'common/contract'
import { DOMAIN } from 'common/envs/constants'
import { useState } from 'react'
import { AnswersGraph } from 'web/components/answers/answers-graph'
import { BetInline } from 'web/components/bet-inline'
import { Button } from 'web/components/button'
import {
  BinaryResolutionOrChance,
  FreeResponseResolutionOrChance,
  NumericResolutionOrExpectation,
  PseudoNumericResolutionOrExpectation,
} from 'web/components/contract/contract-card'
import { MarketSubheader } from 'web/components/contract/contract-details'
import { ContractProbGraph } from 'web/components/contract/contract-prob-graph'
import { NumericGraph } from 'web/components/contract/numeric-graph'
import { Col } from 'web/components/layout/col'
import { Row } from 'web/components/layout/row'
import { Spacer } from 'web/components/layout/spacer'
import { SiteLink } from 'web/components/site-link'
import { useContractWithPreload } from 'web/hooks/use-contract'
import { useMeasureSize } from 'web/hooks/use-measure-size'
import { fromPropz, usePropz } from 'web/hooks/use-propz'
import { useTracking } from 'web/hooks/use-tracking'
import { listAllBets } from 'web/lib/firebase/bets'
import {
  contractPath,
  getContractFromSlug,
  tradingAllowed,
} from 'web/lib/firebase/contracts'
import Custom404 from '../../404'

export const getStaticProps = fromPropz(getStaticPropz)
export async function getStaticPropz(props: {
  params: { username: string; contractSlug: string }
}) {
  const { contractSlug } = props.params
  const contract = (await getContractFromSlug(contractSlug)) || null
  const contractId = contract?.id

  const bets = contractId ? await listAllBets(contractId) : []

  return {
    props: { contract, bets },
    revalidate: 60, // regenerate after a minute
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export default function ContractEmbedPage(props: {
  contract: Contract | null
  bets: Bet[]
}) {
  props = usePropz(props, getStaticPropz) ?? { contract: null, bets: [] }

  const contract = useContractWithPreload(props.contract)
  const { bets } = props

  if (!contract) {
    return <Custom404 />
  }

  return <ContractEmbed contract={contract} bets={bets} />
}

export function ContractEmbed(props: { contract: Contract; bets: Bet[] }) {
  const { contract, bets } = props
  const { question, outcomeType } = contract

  useTracking('view market embed', {
    slug: contract.slug,
    contractId: contract.id,
    creatorId: contract.creatorId,
  })

  const isBinary = outcomeType === 'BINARY'
  const isPseudoNumeric = outcomeType === 'PSEUDO_NUMERIC'

  const href = `https://${DOMAIN}${contractPath(contract)}`

  const { setElem, height: graphHeight } = useMeasureSize()

  const [betPanelOpen, setBetPanelOpen] = useState(false)

  const [probAfter, setProbAfter] = useState<number>()

  return (
    <Col className="h-[100vh] w-full bg-white">
      <Row className="justify-between gap-4 px-2">
        <div className="text-xl text-indigo-700 md:text-2xl">
          <SiteLink href={href}>{question}</SiteLink>
        </div>
        {isBinary && (
          <BinaryResolutionOrChance contract={contract} probAfter={probAfter} />
        )}

        {isPseudoNumeric && (
          <PseudoNumericResolutionOrExpectation contract={contract} />
        )}

        {outcomeType === 'FREE_RESPONSE' && (
          <FreeResponseResolutionOrChance contract={contract} truncate="long" />
        )}

        {outcomeType === 'NUMERIC' && (
          <NumericResolutionOrExpectation contract={contract} />
        )}
      </Row>
      <Spacer h={3} />
      <Row className="items-center justify-between gap-4 px-2">
        <MarketSubheader contract={contract} disabled />

        {(isBinary || isPseudoNumeric) &&
          tradingAllowed(contract) &&
          !betPanelOpen && (
            <Button color="gradient" onClick={() => setBetPanelOpen(true)}>
              Predict
            </Button>
          )}
      </Row>

      <Spacer h={2} />

      {(isBinary || isPseudoNumeric) && betPanelOpen && (
        <BetInline
          contract={contract as any}
          setProbAfter={setProbAfter}
          onClose={() => setBetPanelOpen(false)}
          className="self-center"
        />
      )}

      <div className="mx-1 mb-2 min-h-0 flex-1" ref={setElem}>
        {(isBinary || isPseudoNumeric) && (
          <ContractProbGraph
            contract={contract}
            bets={[...bets].reverse()}
            height={graphHeight}
          />
        )}

        {(outcomeType === 'FREE_RESPONSE' ||
          outcomeType === 'MULTIPLE_CHOICE') && (
          <AnswersGraph contract={contract} bets={bets} height={graphHeight} />
        )}

        {outcomeType === 'NUMERIC' && (
          <NumericGraph contract={contract} height={graphHeight} />
        )}
      </div>
    </Col>
  )
}
