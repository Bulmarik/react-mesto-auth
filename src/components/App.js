import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import RemovePlacePopup from './RemovePlacePopup';
import ImagePopup from './ImagePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import * as auth from '../utils/auth';

export default function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isRemovePlacePopupOpen, setIsRemovePlacePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState("");

  const [loggedIn, setLoggedIn] = React.useState(false)
  const [email, setEmail] = React.useState("");
  const history = useHistory();
  const [infoTool, setInfoTool] = React.useState({message: '', icon: ''});
  
  React.useEffect(() => {
    if(loggedIn) {
      api.getUser()
        .then((res) => {
          setCurrentUser(res);
        })
        .catch((res) => {
          console.log(`Ошибка: ${res.status}`);
        })
    }
  }, [loggedIn])
  
  React.useEffect(() => {
    if(loggedIn) {
      api.getInitialCards()
        .then((initialCards) => {
          setCards(initialCards)
        })
        .catch((res) => {
          console.log(`Ошибка: ${res.status}`);
        })
    }
  }, [loggedIn])
  

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.getContent(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            history.push("/mesto");
            setEmail(res.data.email);
          }
        })
        .catch((res) => {
          console.log(`Ошибка: ${res.status}`);
        })
    }
  }, [history])

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleRemovePlaceClick(card) {
    setIsRemovePlacePopupOpen(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
    setIsRemovePlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
  }
  
  function handleUpdateAvatar(data) {
    api.setAvatar(data)
      .then ((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((res) => {
        console.log(`Ошибка: ${res.status}`);
      })
  }

  function handleUpdateUser(data) {
    api.setUser(data.name, data.about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((res) => {
        console.log(`Ошибка: ${res.status}`);
      })
  }
  
  function handleAddPlaceSubmit(data) {
    api.addNewCard(data)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((res) => {
        console.log(`Ошибка: ${res.status}`);
      })
  }
  
  function handleCardDelete(card) {
    api.delCard(card._id)
      .then(() => {
        const newList = cards.filter((c) => c._id !== card._id);
        setCards(newList);
        closeAllPopups();
      })
      .catch((res) => {
        console.log(`Ошибка: ${res.status}`);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        setCards(newCards)
      })
      .catch((res) => {
        console.log(`Ошибка: ${res.status}`);
      })
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleInfoTooltip(data) {
    setIsInfoTooltipOpen(true);
    setInfoTool(data);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div>
        <Header
          email={email}
        />

        <Switch>
          <ProtectedRoute 
            path="/mesto"
            loggedIn={loggedIn}
            component={Main}
              className="content"
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleRemovePlaceClick}
          />
            
          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
          </Route>

          <Route path="/sign-up">
            <Register onInfoTooltip={handleInfoTooltip}/>
          </Route>

          <Route>
            {loggedIn ? (<Redirect to="/mesto" />) : (<Redirect to="sign-in" />)}
          </Route>
        </Switch>
      
        <Footer />

        {/* Аватарка */}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
      
        {/* Юзер */}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
      
        {/* Добавление карточек */}
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
      
        {/* Удаление карточек */}
        <RemovePlacePopup
          isOpen={isRemovePlacePopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
        />
      
        {/* Просмотр картинок */}
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        {/* Инфо о регистрации */}
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          infoTool={infoTool}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}