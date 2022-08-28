// From https://tailwindui.com/components/application-ui/lists/feeds
import React from 'react'
import {
  BanIcon,
  CheckIcon,
  LockClosedIcon,
  XIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'

import { OutcomeLabel } from '../outcome-label'
import {
  Contract,
  contractPath,
  tradingAllowed,
} from 'web/lib/firebase/contracts'
import { BinaryResolutionOrChance } from '../contract/contract-card'
import { SiteLink } from '../site-link'
import { Col } from '../layout/col'
import { UserLink } from '../user-page'
import BetButton from '../bet-button'
import { Avatar } from '../avatar'
import { ActivityItem } from './activity-items'
import { useUser } from 'web/hooks/use-user'
import { trackClick } from 'web/lib/firebase/tracking'
import { DAY_MS } from 'common/util/time'
import NewContractBadge from '../new-contract-badge'
import { RelativeTimestamp } from '../relative-timestamp'
import { FeedAnswerCommentGroup } from 'web/components/feed/feed-answer-comment-group'
import {
  FeedCommentThread,
  CommentInput,
} from 'web/components/feed/feed-comments'
import { FeedBet } from 'web/components/feed/feed-bets'
import { CPMMBinaryContract, NumericContract } from 'common/contract'
import { FeedLiquidity } from './feed-liquidity'
import { BetSignUpPrompt } from '../sign-up-prompt'
import { User } from 'common/user'
import { PlayMoneyDisclaimer } from '../play-money-disclaimer'
import { contractMetrics } from 'common/contract-details'

export function FeedItems(props: {
  contract: Contract
  items: ActivityItem[]
  className?: string
  betRowClassName?: string
  user: User | null | undefined
}) {
  const { contract, items, className, betRowClassName, user } = props
  const { outcomeType } = contract

  return (
    <div className={clsx('flow-root', className)}>
      <div className={clsx(tradingAllowed(contract) ? '' : '-mb-6')}>
        {items.map((item, activityItemIdx) => (
          <div key={item.id} className={'relative pb-4'}>
            {activityItemIdx !== items.length - 1 ||
            item.type === 'answergroup' ? (
              <span
                className="absolute top-5 left-5 -ml-px h-[calc(100%-2rem)] w-0.5 bg-gray-200"
                aria-hidden="true"
              />
            ) : null}
            <div className="relative flex-col items-start space-x-3">
              <FeedItem item={item} />
            </div>
          </div>
        ))}
      </div>

      {!user ? (
        <Col className="mt-4 max-w-sm items-center xl:hidden">
          <BetSignUpPrompt />
          <PlayMoneyDisclaimer />
        </Col>
      ) : (
        outcomeType === 'BINARY' &&
        tradingAllowed(contract) && (
          <BetButton
            contract={contract as CPMMBinaryContract}
            className={clsx('mb-2', betRowClassName)}
          />
        )
      )}
    </div>
  )
}

export function FeedItem(props: { item: ActivityItem }) {
  const { item } = props

  switch (item.type) {
    case 'question':
      return <FeedQuestion {...item} />
    case 'description':
      return <FeedDescription {...item} />
    case 'bet':
      return <FeedBet {...item} />
    case 'liquidity':
      return <FeedLiquidity {...item} />
    case 'answergroup':
      return <FeedAnswerCommentGroup {...item} />
    case 'close':
      return <FeedClose {...item} />
    case 'resolve':
      return <FeedResolve {...item} />
    case 'commentInput':
      return <CommentInput {...item} />
    case 'commentThread':
      return <FeedCommentThread {...item} />
  }
}

export function FeedQuestion(props: {
  contract: Contract
  contractPath?: string
}) {
  const { contract } = props
  const {
    creatorName,
    creatorUsername,
    question,
    outcomeType,
    volume,
    createdTime,
    isResolved,
  } = contract
  const { volumeLabel } = contractMetrics(contract)
  const isBinary = outcomeType === 'BINARY'
  const isNew = createdTime > Date.now() - DAY_MS && !isResolved
  const user = useUser()

  return (
    <div className={'flex gap-2'}>
      <Avatar
        username={contract.creatorUsername}
        avatarUrl={contract.creatorAvatarUrl}
      />
      <div className="min-w-0 flex-1 py-1.5">
        <div className="mb-2 text-sm text-gray-500">
          <UserLink
            className="text-gray-900"
            name={creatorName}
            username={creatorUsername}
          />{' '}
          asked
          {/* Currently hidden on mobile; ideally we'd fit this in somewhere. */}
          <div className="relative -top-2 float-right ">
            {isNew || volume === 0 ? (
              <NewContractBadge />
            ) : (
              <span className="hidden text-gray-400 sm:inline">
                {volumeLabel}
              </span>
            )}
          </div>
        </div>
        <Col className="items-start justify-between gap-2 sm:flex-row sm:gap-4">
          <SiteLink
            href={
              props.contractPath ? props.contractPath : contractPath(contract)
            }
            onClick={() => user && trackClick(user.id, contract.id)}
            className="text-lg text-indigo-700 sm:text-xl"
          >
            {question}
          </SiteLink>
          {isBinary && (
            <BinaryResolutionOrChance
              className="items-center"
              contract={contract}
            />
          )}
        </Col>
      </div>
    </div>
  )
}

function FeedDescription(props: { contract: Contract }) {
  const { contract } = props
  const { creatorName, creatorUsername } = contract

  return (
    <>
      <Avatar
        username={contract.creatorUsername}
        avatarUrl={contract.creatorAvatarUrl}
      />
      <div className="min-w-0 flex-1 py-1.5">
        <div className="text-sm text-gray-500">
          <UserLink
            className="text-gray-900"
            name={creatorName}
            username={creatorUsername}
          />{' '}
          created this market <RelativeTimestamp time={contract.createdTime} />
        </div>
      </div>
    </>
  )
}

function OutcomeIcon(props: { outcome?: string }) {
  const { outcome } = props
  switch (outcome) {
    case 'YES':
      return <CheckIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
    case 'NO':
      return <XIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
    case 'CANCEL':
      return <BanIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
    default:
      return <CheckIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
  }
}

function FeedResolve(props: { contract: Contract }) {
  const { contract } = props
  const { creatorName, creatorUsername } = contract

  const resolution = contract.resolution || 'CANCEL'

  const resolutionValue = (contract as NumericContract).resolutionValue

  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <OutcomeIcon outcome={resolution} />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <div className="text-sm text-gray-500">
          <UserLink
            className="text-gray-900"
            name={creatorName}
            username={creatorUsername}
          />{' '}
          resolved this market to{' '}
          <OutcomeLabel
            outcome={resolution}
            value={resolutionValue}
            contract={contract}
            truncate="long"
          />{' '}
          <RelativeTimestamp time={contract.resolutionTime || 0} />
        </div>
      </div>
    </>
  )
}

function FeedClose(props: { contract: Contract }) {
  const { contract } = props

  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <LockClosedIcon
              className="h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <div className="text-sm text-gray-500">
          Trading closed in this market{' '}
          <RelativeTimestamp time={contract.closeTime || 0} />
        </div>
      </div>
    </>
  )
}
