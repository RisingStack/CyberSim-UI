import React, { useRef, useCallback } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { map as _map } from 'lodash';

import { useStaticData } from '../../StaticDataProvider';
import { gameStore } from '../../GameStore';
import { numberToUsd } from '../../../util';

const Curveballs = ({ className }) => {
  const { curveballs } = useStaticData();
  const {
    actions: { performCurveball },
    popError,
    closeError,
  } = gameStore;

  const formRef = useRef();

  const submitCurveball = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isValid =
        event.target.checkValidity() &&
        event.target?.curveballs?.value;
      if (isValid) {
        closeError();
        performCurveball({
          curveballId: event.target.curveballs.value,
        });
        formRef.current.reset();
      } else {
        popError('Please select an action.');
      }
    },
    [popError, closeError, performCurveball],
  );

  return (
    <Form onSubmit={submitCurveball} noValidate ref={formRef}>
      <Row className={className}>
        <Col xs={9}>
          <h3>CURVEBALL EVENTS</h3>
        </Col>
        <Col xs={3}>
          <Button
            variant="outline-primary"
            className="rounded-pill w-100"
            type="submit"
          >
            TRIGGER EVENT
          </Button>
        </Col>
        <Col>
          {_map(curveballs, (curveball) => (
            <Form.Check
              custom
              required
              type="radio"
              className="custom-radio-right"
              key={curveball.id}
              label={
                <Row className="py-1 select-row align-items-center">
                  <Col xs={9}>{curveball.description}</Col>
                  <Col className="text-right">
                    {curveball.budget_decrease
                      ? `Budget: -${numberToUsd(
                          curveball.budget_decrease,
                        )}`
                      : ''}
                    {curveball.poll_decrease &&
                    curveball.budget_decrease
                      ? ', '
                      : ''}
                    {curveball.poll_decrease
                      ? `Poll: -${curveball.poll_decrease}%`
                      : ''}
                  </Col>
                </Row>
              }
              name="curveballs"
              id={curveball.id}
              value={curveball.id}
            />
          ))}
        </Col>
      </Row>
    </Form>
  );
};

export default Curveballs;