import {
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import classNames from 'classnames';

import { numberToUsd } from '../../util';
import { useCallback } from 'react';

const MitigationCategory = ({
  name,
  mitigations,
  toggledMitigations,
  toggleMitigation,
  allocatedBudget,
  budget,
  isSummary,
}) => {
  const getTooltipMessage = useCallback(
    (mitigation, location) => {
      if (
        (location === 'hq' && !mitigation.is_hq) ||
        (location === 'local' && !mitigation.is_local)
      ) {
        return 'This item is not available for this location!';
      }

      if (
        !toggledMitigations[`${mitigation.id}_${location}`] &&
        budget < mitigation[`${location}_cost`]
      ) {
        return "Yout don't have the budget to purchase this item!";
      }

      if (toggledMitigations[`${mitigation.id}_${location}`]) {
        return 'You have alraedy purchased this item. Click to return!';
      }

      return 'Click to purchase this item!';
    },
    [toggledMitigations, budget],
  );
  return (
    <div className={classNames('py-3', isSummary ? 'my-3' : 'my-5')}>
      <Row className="pb-2">
        <Col xs={10}>
          <h4 className="m-0 font-weight-normal border-bottom border-primary w-100 text-uppercase">
            ALLOCATED <span className="font-weight-bold">{name}</span>{' '}
            BUDGET : {numberToUsd(allocatedBudget)}
          </h4>
        </Col>
        <Col xs={2}>
          <Row>
            <Col xs={4} className="text-center" title="Cost">
              Cost
            </Col>
            <Col
              xs={4}
              className="text-center column-title-ellipsis"
              title="HQ"
            >
              HQ
            </Col>
            <Col
              xs={4}
              className="text-center column-title-ellipsis"
              title="Local"
            >
              Local
            </Col>
          </Row>
        </Col>
      </Row>
      {mitigations
        .toSorted((mitigation1, mitigation2) =>
          mitigation1.description > mitigation2.description ? 1 : -1,
        )
        .map((mitigation) => (
          <Row className="py-2 select-row" key={mitigation.id}>
            <Col xs={10}>{mitigation.description}</Col>
            <Col xs={2}>
              <Row>
                {!isSummary ? (
                  <>
                    <Col
                      xs={4}
                      className="justify-content-center d-flex"
                    >
                      <span>
                        {
                          numberToUsd(
                            mitigation.hq_cost,
                          ) /* "hq_cost" = "local_cost" in every case */
                        }
                      </span>
                    </Col>

                    <Col xs={4}>
                      <OverlayTrigger
                        overlay={(props) => (
                          <Tooltip {...props}>
                            {getTooltipMessage(mitigation, 'hq')}
                          </Tooltip>
                        )}
                        placement="bottom"
                      >
                        {mitigation.is_hq ? (
                          <div>
                            {/* This "div" is required for the tooltips to work correctly! */}
                            <Form.Check
                              type="switch"
                              className="custom-switch-center"
                              id={`${mitigation.id}_hq`}
                              disabled={
                                !mitigation.is_hq ||
                                (!toggledMitigations[
                                  `${mitigation.id}_hq`
                                ] &&
                                  budget < mitigation.hq_cost)
                              }
                              checked={
                                toggledMitigations[
                                  `${mitigation.id}_hq`
                                ]
                              }
                              onChange={(e) =>
                                toggleMitigation({
                                  id: mitigation.id,
                                  type: 'hq',
                                  value: e.target.checked,
                                })
                              }
                            />
                          </div>
                        ) : (
                          <div className="d-flex align-items-center">
                            <AiOutlineClose
                              className="ml-2"
                              fontSize="20px"
                            />
                          </div>
                        )}
                      </OverlayTrigger>
                    </Col>

                    <Col xs={4}>
                      <OverlayTrigger
                        overlay={(props) => (
                          <Tooltip {...props}>
                            {getTooltipMessage(mitigation, 'local')}
                          </Tooltip>
                        )}
                        placement="bottom"
                      >
                        {mitigation.is_local ? (
                          <div>
                            {/* This "div" is required for the tooltips to work correctly! */}
                            <Form.Check
                              type="switch"
                              className="custom-switch-center"
                              id={`${mitigation.id}_local`}
                              disabled={
                                !mitigation.is_local ||
                                (!toggledMitigations[
                                  `${mitigation.id}_local`
                                ] &&
                                  budget < mitigation.local_cost)
                              }
                              label=" "
                              checked={
                                toggledMitigations[
                                  `${mitigation.id}_local`
                                ]
                              }
                              onChange={(e) =>
                                toggleMitigation({
                                  id: mitigation.id,
                                  type: 'local',
                                  value: e.target.checked,
                                })
                              }
                            />
                          </div>
                        ) : (
                          <div className="d-flex align-items-center">
                            <AiOutlineClose
                              className="ml-2"
                              fontSize="20px"
                            />
                          </div>
                        )}
                      </OverlayTrigger>
                    </Col>
                  </>
                ) : (
                  <div></div>
                )}
                {/* {mitigation.is_hq &&
                  (!isSummary ? (
                    <Form.Check
                      type="switch"
                      className="custom-switch-right"
                      id={`${mitigation.id}_hq`}
                      label={
                        <span>{numberToUsd(mitigation.hq_cost)}</span>
                      }
                      disabled={
                        !toggledMitigations[`${mitigation.id}_hq`] &&
                        budget < mitigation.hq_cost
                      }
                      checked={
                        toggledMitigations[`${mitigation.id}_hq`]
                      }
                      onChange={(e) =>
                        toggleMitigation({
                          id: mitigation.id,
                          type: 'hq',
                          value: e.target.checked,
                        })
                      }
                    />
                  ) : (
                    <div className="d-flex align-items-center">
                      {numberToUsd(mitigation.hq_cost)}
                      {toggledMitigations[`${mitigation.id}_hq`] ? (
                        <AiOutlineCheck
                          className="ml-2"
                          fontSize="20px"
                        />
                      ) : (
                        <AiOutlineClose
                          className="ml-2"
                          fontSize="20px"
                          />
                          )}
                          </div>
                        ))} */}
              </Row>
            </Col>
          </Row>
        ))}
    </div>
  );
};

export default MitigationCategory;
