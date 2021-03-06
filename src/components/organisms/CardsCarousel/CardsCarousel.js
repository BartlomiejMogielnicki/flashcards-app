import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FlipCard from '../../molecules/FlipCard/FlipCard';

const StyledWrapper = styled.div`
  perspective: 1000px;
  width: 80%;
  max-width: 600px;
  height: 100%;
  max-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: white;
  box-shadow: 0 0 10px 10px white;
  overflow-x: hidden;

  @media (max-width: 550px) {
    max-height: 200px;
  }

  @media (max-height: 600px) {
    max-height: 150px;
    max-width: 500px;
  }
`;

class CardsCarousel extends Component {
  state = {
    swapDirection: 'right',
  };

  componentDidUpdate(prevProps) {
    const { activeCard } = this.props;
    let { swapDirection } = this.state;
    if (activeCard > prevProps.activeCard) {
      swapDirection = 'right';
      this.setState({
        swapDirection,
      });
    } else if (activeCard < prevProps.activeCard) {
      swapDirection = 'left';
      this.setState({
        swapDirection,
      });
    }
  }

  handleRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  render() {
    const { swapDirection } = this.state;
    const { cards, activeCard } = this.props;
    return (
      <StyledWrapper>
        {cards[activeCard - 1] && (
          <FlipCard
            key={this.handleRandomId()}
            cardLeft
            card={cards[activeCard - 1]}
            activeCard={activeCard - 1}
            swapDirection={swapDirection}
          />
        )}
        <FlipCard
          key={this.handleRandomId()}
          card={cards[activeCard]}
          activeCard={activeCard}
          swapDirection={swapDirection}
        />
        {cards[activeCard + 1] && (
          <FlipCard
            key={this.handleRandomId()}
            cardRight
            card={cards[activeCard + 1]}
            activeCard={activeCard + 1}
            swapDirection={swapDirection}
          />
        )}
      </StyledWrapper>
    );
  }
}

CardsCarousel.propTypes = {
  cards: PropTypes.instanceOf(Array),
  activeCard: PropTypes.number,
};

CardsCarousel.defaultProps = {
  cards: null,
  activeCard: null,
};

export default CardsCarousel;
