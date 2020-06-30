import React, { useMemo } from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import { reduce as _reduce } from 'lodash';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { view } from '@risingstack/react-easy-state';
import { keyBy as _keyBy } from 'lodash';

import { gameStore } from '../../GameStore';
import { msToMinutesSeconds } from '../../../util';
import { useStaticData } from '../../StaticDataProvider';

const Threats = view(({ className }) => {
  const {
    mitigations: gameMitigations,
    injections: gameInjections,
    prevented_injections: preventedInjections,
  } = gameStore;
  const { injections } = useStaticData();

  const gameInjectionsByInjectionId = useMemo(
    () => _keyBy(gameInjections, 'injection_id'),
    [gameInjections],
  );

  const { threats, notThreats } = useMemo(
    () =>
      injections
        ? _reduce(
            injections,
            (
              acc,
              {
                trigger_time: triggerTime,
                skipper_mitigation: skipMitigation,
                skipper_mitigation_type: skipType,
                title,
                id,
                location,
              },
            ) => {
              // Was not injected yet
              if (!gameInjectionsByInjectionId[id]) {
                const localUp =
                  skipMitigation &&
                  gameMitigations[`${skipMitigation}_local`];
                const hqUp =
                  skipMitigation &&
                  gameMitigations[`${skipMitigation}_hq`];
                // Prevented or will be prevented
                if (
                  (skipType === 'party' && localUp && hqUp) ||
                  (skipType === 'hq' && hqUp) ||
                  (skipType === 'local' && localUp) ||
                  preventedInjections.some(
                    (preventedId) => preventedId === id,
                  )
                ) {
                  acc.notThreats.push({
                    desc:
                      msToMinutesSeconds(triggerTime) +
                      ' - ' +
                      (title || id),
                    location: location?.toUpperCase() || 'PARTY',
                  });
                  return acc;
                }
              }
              acc.threats.push({
                desc:
                  msToMinutesSeconds(triggerTime) +
                  ' - ' +
                  (title || id),
                location: location?.toUpperCase() || 'PARTY',
              });
              return acc;
            },
            {
              threats: [],
              notThreats: [],
            },
          )
        : {
            threats: [],
            notThreats: [],
          },
    [
      gameInjectionsByInjectionId,
      gameMitigations,
      injections,
      preventedInjections,
    ],
  );

  return (
    <Row className={className} id="threats">
      <Col lg={6} className="mb-4 mb-lg-0">
        <Card
          className="shadow-sm h-100 border-primary"
          style={{ borderRadius: '1rem' }}
        >
          <Card.Header
            as="h3"
            className="border-primary bg-white"
            style={{ borderRadius: '1rem 1rem 0 0' }}
          >
            MITIGATED THREATS:
          </Card.Header>
          <Card.Body
            className="pb-3"
            style={{ maxHeight: '365px', overflowY: 'scroll' }}
          >
            {!!notThreats.length &&
              notThreats.map(({ desc, location }, i) => (
                <Row
                  key={i}
                  className="d-flex align-items-center mb-2 justify-content-between select-row"
                >
                  <Col xs={10}>
                    <AiOutlineCheck
                      className="mr-2"
                      fontSize="20px"
                    />
                    {desc}
                  </Col>
                  <Col xs={2} className="text-right">
                    {location}
                  </Col>
                </Row>
              ))}
            {!injections && (
              <Col xs={12} className="d-flex justify-content-center">
                <Spinner animation="border" />
              </Col>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6}>
        <Card
          className="shadow-sm h-100 border-primary"
          style={{ borderRadius: '1rem' }}
        >
          <Card.Header
            as="h3"
            className="border-primary bg-white"
            style={{ borderRadius: '1rem 1rem 0 0' }}
          >
            NOT MITIGATED THREATS:
          </Card.Header>
          <Card.Body
            className="pb-3"
            style={{ maxHeight: '365px', overflowY: 'scroll' }}
          >
            {!!threats.length &&
              threats.map(({ desc, location }, i) => (
                <Row
                  key={i}
                  className="d-flex align-items-center mb-2 justify-content-between select-row"
                >
                  <Col xs={10}>
                    <AiOutlineClose
                      className="mr-2"
                      fontSize="20px"
                    />
                    {desc}
                  </Col>
                  <Col xs={2} className="text-right">
                    {location}
                  </Col>
                </Row>
              ))}
            {!injections && (
              <Col xs={12} className="d-flex justify-content-center">
                <Spinner animation="border" />
              </Col>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
});

export default Threats;