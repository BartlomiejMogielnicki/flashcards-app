import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/atoms/Button/Button';
import EmptySlot from '../components/atoms/EmptySlot/EmptySlot';
import ItemModal from '../components/organisms/ItemModal/ItemModal';

const StyledWrapper = styled.div`
  perspective: 1000px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;

  @media (max-height: 600px) {
    padding: 5px;
  }
`;

const StyledHeading = styled.h2`
  margin-bottom: 10px;
  color: white;
  text-align: center;

  @media (max-height: 600px) {
    margin-bottom: 5px;
    font-size: 1.2rem;
  }
`;

const StyledCardsList = styled.ul`
  margin: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
  grid-template-rows: repeat(auto-fill, 210px);
  grid-gap: 20px 40px;
  justify-content: center;
  justify-items: center;
`;

const StyledCardItem = styled.li`
  width: 170px;
  height: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 2px solid #555;
`;

const StyledCard = styled.div`
  margin: 10px;
  padding: 5px;
  width: 150px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  text-align: center;
  font-size: 0.7rem;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
`;

const StyledCardNumber = styled.div`
  height: 20px;
  width: 20px;
  position: absolute;
  top: -10px;
  left: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.secondaryColor};
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
`;

const StyledDeleteButton = styled.button`
  height: 20px;
  width: 20px;
  position: absolute;
  bottom: -10px;
  right: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 0, 0, 0.7);
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  transition: 0.3s;

  :hover {
    background-color: rgba(255, 0, 0, 1);
  }
`;

const StyledControlsContainer = styled.div`
  margin: 20px auto;
  width: 200px;
  display: flex;
  justify-content: space-around;
`;

class EditorsView extends Component {
  state = {
    collections: [],
    newCard: {
      showModal: false,
      cardQuestion: '',
      cardAnswer: '',
      showQuestionError: false,
      showAnswerError: false,
    },
  };

  componentDidMount() {
    const { location } = this.props;
    const { collections } = location.state;
    this.setState({
      collections,
    });
  }

  handleCardDelete = (cardId, title) => {
    const { collections } = this.state;
    let index;
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].title === title) {
        index = i;
      }
    }
    const collection = collections[index].cards.filter((card) => {
      return card.id !== cardId;
    });
    collections[index].cards = collection;
    this.setState({
      collections,
    });
  };

  handleCardAdd = (e, type) => {
    e.preventDefault();

    const { newCard } = this.state;

    if (e.type === 'change' && type === 'question') {
      newCard.cardQuestion = e.target.value;
      this.setState({
        newCard,
      });
    } else if (e.type === 'change' && type === 'answer') {
      newCard.cardAnswer = e.target.value;
      this.setState({
        newCard,
      });
    } else if (e.type === 'click') {
      newCard.cardQuestion = '';
      newCard.cardAnswer = '';
      newCard.showModal = !newCard.showModal;
      newCard.showQuestionError = false;
      newCard.showAnswerError = false;
      this.setState({
        newCard,
      });
    } else if (e.type === 'submit') {
      const { collections } = this.state;
      let index;
      if (newCard.cardQuestion === '' && newCard.cardAnswer === '') {
        newCard.showQuestionError = true;
        newCard.showAnswerError = true;
        this.setState({
          newCard,
        });
      } else if (newCard.cardQuestion === '') {
        newCard.showQuestionError = true;
        newCard.showAnswerError = false;
        this.setState({
          newCard,
        });
      } else if (newCard.cardAnswer === '') {
        newCard.showAnswerError = true;
        newCard.showQuestionError = false;
        this.setState({
          newCard,
        });
      } else {
        for (let i = 0; i < collections.length; i++) {
          if (collections[i].title === type) {
            index = i;
            break;
          }
        }
        const createdCard = {
          question: newCard.cardQuestion,
          answer: newCard.cardAnswer,
          id: this.handleRandomId(),
        };
        collections[index].cards.push(createdCard);
        newCard.cardQuestion = '';
        newCard.cardAnswer = '';
        newCard.showQuestionError = false;
        newCard.showAnswerError = false;
        newCard.showModal = !newCard.showModal;
        this.setState({
          collections,
        });
      }
    }
  };

  handleRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  render() {
    const { location } = this.props;
    const { title } = location.state;
    const { collections, newCard } = this.state;
    let collection;
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].title === title) {
        collection = collections[i];
      }
    }
    let cards;
    if (collection) {
      cards = collection.cards.map((card, index) => (
        <StyledCardItem key={card.id}>
          <StyledCard>{card.question}</StyledCard>
          <StyledCard>{card.answer}</StyledCard>
          <StyledCardNumber>{index + 1}</StyledCardNumber>
          <StyledDeleteButton onClick={() => this.handleCardDelete(card.id, title)}>
            x
          </StyledDeleteButton>
        </StyledCardItem>
      ));
    }
    return (
      <StyledWrapper>
        <StyledHeading>{title}</StyledHeading>
        <StyledCardsList>
          {cards}
          <EmptySlot small clicked={this.handleCardAdd} />
        </StyledCardsList>
        <StyledControlsContainer>
          <Link
            to={{
              pathname: '/collections',
              state: { collections },
            }}
          >
            <Button icon="save" />
          </Link>
          <Link
            to={{
              pathname: '/collections',
            }}
          >
            <Button icon="discard" />
          </Link>
        </StyledControlsContainer>
        {newCard.showModal ? (
          <ItemModal
            addCard={this.handleCardAdd}
            question={newCard.cardQuestion}
            answer={newCard.cardAnswer}
            title={title}
            showQuestionError={newCard.showQuestionError}
            showAnswerError={newCard.showAnswerError}
          />
        ) : null}
      </StyledWrapper>
    );
  }
}
EditorsView.propTypes = {
  location: PropTypes.any,
  collections: PropTypes.instanceOf(Array),
};

EditorsView.defaultProps = {
  location: null,
  collections: null,
};
export default EditorsView;
