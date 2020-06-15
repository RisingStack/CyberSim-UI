import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
} from 'react-bootstrap';

import { useGame } from '../GameProvider';
import MitigationCategory from './MitigationCategory';
import { numberToUsd } from '../../util';

const Preparation = () => {
  const {
    id,
    budget,
    mitigations,
    actions: { toggleMitigation, startSimulation },
  } = useGame();

  const [
    mitigationsByCategory,
    setMitigationsByCategory,
  ] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/mitigations`)
      .then(({ data }) => {
        setMitigationsByCategory(
          data.reduce(
            (categories, item) => ({
              ...categories,
              [item.category]: [
                ...(categories[item.category] || []),
                item,
              ],
            }),
            {},
          ),
        );
      })
      .catch((e) => console.error(e));
  }, [setMitigationsByCategory]);

  const allocatedCategoryBudgets = useMemo(
    () =>
      mitigationsByCategory
        ? Object.keys(mitigationsByCategory).reduce(
            (acc, categoryKey) => {
              const categorySum = mitigationsByCategory[
                categoryKey
              ].reduce((sum, { id, hq_cost, local_cost }) => {
                let newSum = sum;
                if (mitigations[`${id}_hq`] && hq_cost) {
                  newSum += hq_cost;
                }
                if (mitigations[`${id}_local`] && local_cost) {
                  newSum += local_cost;
                }
                return newSum;
              }, 0);
              return {
                ...acc,
                [categoryKey]: categorySum,
                sum: (acc.sum || 0) + categorySum,
              };
            },
            {},
          )
        : { sum: 0 },
    [mitigationsByCategory, mitigations],
  );

  return (
    <div>
      <div className="pt-4" />
      <div
        className="py-3 border-primary border-bottom position-sticky bg-white"
        style={{ top: 0, zIndex: 1 }}
      >
        <Container fluid="md">
          <Row>
            <Col>
              <h3 className="m-0">
                <span className="mr-1">Budget Allocated:</span>
                {numberToUsd(allocatedCategoryBudgets.sum)}
              </h3>
            </Col>
            <Col className="text-right">
              <h3 className="m-0">
                <span className="mr-1">Remaining Budget:</span>
                {numberToUsd(budget)}
              </h3>
            </Col>
          </Row>
        </Container>
      </div>
      <Container fluid="md" className="mb-5 pb-5">
        {mitigationsByCategory ? (
          Object.keys(mitigationsByCategory).map((key) => (
            <MitigationCategory
              key={key}
              name={key}
              mitigations={mitigationsByCategory[key]}
              gameMitigations={mitigations}
              allocatedBudget={allocatedCategoryBudgets[key]}
              toggleMitigation={toggleMitigation}
            />
          ))
        ) : (
          <Spinner
            animation="border"
            className="position-fixed"
            style={{ left: '50%', top: '50%' }}
          />
        )}
      </Container>
      <div
        className="py-4 border-primary border-top position-fixed w-100 bg-white"
        style={{ bottom: 0 }}
      >
        <Container fluid="md">
          <Row>
            <Col md={8}>
              <Button
                variant="outline-primary"
                className="rounded-pill"
                type="button"
                disabled={!mitigationsByCategory}
                onClick={startSimulation}
              >
                <h4 className="font-weight-normal mb-0">
                  SAVE Budget and START Simulation
                </h4>
              </Button>
            </Col>
            <Col md={4} className="text-right">
              <Button
                variant="outline-primary"
                className="rounded-pill overflow-scroll"
                type="button"
                onClick={() => console.log('TODO: open projector?')}
              >
                <h4 className="font-weight-normal mb-0">{id}</h4>
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Preparation;
