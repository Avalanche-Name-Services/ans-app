import React from 'react'
import styled from '@emotion/styled'
import {
  ViewOnly as KeyValueViewOnly,
  KeyValueContainer as DefaultKeyValueContainer,
  KeyValuesList as DefaultKeyValuesList,
  Key as DefaultKey
} from './KeyValueRecord/'

import mq from 'mediaQuery'

import { RecordsValue } from './ContentHash.js'
import { isRecordEmpty } from '../../../utils/utils'
import 'cross-fetch/polyfill'
// TODO: Change to eth.link once migrated
const CERTIFICATE_HOST = 'eth.domains'

const Key = styled(DefaultKey)`
  ${mq.small`
    margin-bottom: 0;
  `}
`

const KeyValuesList = styled(DefaultKeyValuesList)``

const KeyValueContainer = styled(DefaultKeyValueContainer)`
  padding: 0;
  margin-bottom: 20px;
`

const Contenthash = styled('div')`
  display: flex;
  margin-bottom: 20px;
`

const Delete = styled('span')`
  color: red;
`

function isEthSubdomain(name) {
  let labels = name.split('.')
  let suffix = labels[labels.length - 1]
  return suffix === 'eth' && name !== 'eth'
}

function requestCertificate(parentName) {
  if (window.location.host !== 'app.ens.domains') return
  const fetchUrl = `https://${CERTIFICATE_HOST}/names/${parentName}.domains`
  fetch(fetchUrl, { method: 'PUT' })
}

export default function MultipleRecordsCheck({
  changedRecords,
  contentCreatedFirstTime,
  parentName
}) {
  console.log({
    changedRecords,
    contentCreatedFirstTime,
    isEthSubdomain: isEthSubdomain(parentName)
  })

  if (contentCreatedFirstTime && isEthSubdomain(parentName)) {
    requestCertificate(parentName)
  }
  return (
    <div>
      {changedRecords.coins.length > 0 && (
        <KeyValueContainer>
          <Key>Addresses</Key>
          <KeyValuesList>
            {changedRecords.coins.map(record =>
              record.value === '' ? (
                <KeyValueViewOnly
                  textKey={record.key}
                  value={record.value}
                  remove={true}
                />
              ) : (
                <KeyValueViewOnly textKey={record.key} value={record.value} />
              )
            )}
          </KeyValuesList>
        </KeyValueContainer>
      )}

      {changedRecords.content !== undefined && (
        <Contenthash>
          <Key>Content Hash</Key>
          <RecordsValue>
            {isRecordEmpty(changedRecords.content) ? (
              <Delete>Delete Record</Delete>
            ) : (
              changedRecords.content
            )}
          </RecordsValue>
        </Contenthash>
      )}
      {changedRecords.textRecords.length > 0 && (
        <KeyValueContainer>
          <Key>Text Records</Key>
          <KeyValuesList>
            {changedRecords.textRecords.map(record =>
              record.value === '' ? (
                <KeyValueViewOnly
                  textKey={record.key}
                  value={record.value}
                  remove={true}
                />
              ) : (
                <KeyValueViewOnly textKey={record.key} value={record.value} />
              )
            )}
          </KeyValuesList>
        </KeyValueContainer>
      )}
    </div>
  )
}
