import Link from 'next/link'
import { Col } from '../components/layout/col'
import { Row } from '../components/layout/row'
import { useEffect, useState } from 'react'
import {
  compute,
  Contract,
  listContracts,
  path,
} from '../lib/firebase/contracts'
import { formatMoney } from '../lib/util/format'
import { User } from '../lib/firebase/users'
import { UserLink } from '../pages/account'

export function ContractDetails(props: { contract: Contract }) {
  const { contract } = props
  const { volume, createdDate, resolvedDate } = compute(contract)

  return (
    <Row className="flex-wrap text-sm text-gray-500">
      <div className="whitespace-nowrap">
        <UserLink displayName={contract.creatorName} />
      </div>
      <div className="mx-2">•</div>
      <div className="whitespace-nowrap">
        {resolvedDate ? `${createdDate} - ${resolvedDate}` : createdDate}
      </div>
      <div className="mx-2">•</div>
      <div className="whitespace-nowrap">{formatMoney(volume)} bet</div>
    </Row>
  )
}

function ContractCard(props: { contract: Contract }) {
  const { contract } = props
  const { probPercent } = compute(contract)

  const resolutionColor = {
    YES: 'text-primary',
    NO: 'text-red-400',
    CANCEL: 'text-yellow-400',
    '': '', // Empty if unresolved
  }[contract.resolution || '']

  const resolutionText = {
    YES: 'YES',
    NO: 'NO',
    CANCEL: 'N/A',
    '': '',
  }[contract.resolution || '']

  return (
    <Link href={path(contract)}>
      <a>
        <li className="col-span-1 bg-white hover:bg-gray-100 shadow-xl rounded-lg divide-y divide-gray-200">
          <div className="card">
            <div className="card-body p-6">
              <div className="flex justify-between gap-2">
                {/* Left side of card */}
                <div>
                  <p className="font-medium text-indigo-700 mb-8">
                    {contract.question}
                  </p>
                  <ContractDetails contract={contract} />
                </div>

                {/* Right side of card */}
                <Col>
                  <Col
                    className={'text-4xl mx-auto items-end ' + resolutionColor}
                  >
                    {resolutionText || (
                      <div className="text-primary">
                        {probPercent}
                        <div className="text-lg">chance</div>
                      </div>
                    )}
                  </Col>
                </Col>
              </div>
            </div>
          </div>
        </li>
      </a>
    </Link>
  )
}

export function ContractsGrid(props: { contracts: Contract[] }) {
  const { contracts } = props
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {contracts.map((contract) => (
        <ContractCard contract={contract} key={contract.id} />
      ))}
      {/* TODO: Show placeholder if empty */}
    </ul>
  )
}

export function ContractsList(props: { creator: User }) {
  const { creator } = props
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    if (creator?.id) {
      // TODO: stream changes from firestore
      listContracts(creator.id).then(setContracts)
    }
  }, [creator])

  return <ContractsGrid contracts={contracts} />
}
