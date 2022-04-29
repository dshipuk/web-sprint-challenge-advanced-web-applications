import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axiosWithAuth from "../axios/index";
import axios from "axios";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setMessage("Goodbye!");
    localStorage.removeItem("token");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setSpinnerOn(true);
    setMessage("");
    axiosWithAuth()
      .post("/login", { username, password })
      .then((resp) => {
        localStorage.setItem("token", resp.data.token);
        setMessage(resp.data.message);
        navigate("/articles");
        setSpinnerOn(false);
      })
      .catch(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(true);
    setMessage("");
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:9000/api/articles", {
        headers: {
          authorization: token,
        },
      })
      .then((resp) => {
        setMessage(resp.data.message);
        setArticles(resp.data.articles);
        setSpinnerOn(false);
      })
      .catch(() => {
        navigate("/");
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true);
    setMessage("");
    axiosWithAuth()
      .post("/articles", article)
      .then((resp) => {
        setMessage(resp.data.message);
        setArticles(articles.concat(resp.data.article));
        setSpinnerOn(false);
      })
      .catch(() => {
        redirectToArticles();
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setSpinnerOn(true);

    axiosWithAuth()
      .put(`/articles/${article_id}`, article)
      .then((resp) => {
        setMessage(resp.data.message);
        setArticles(
          articles.map((art) => {
            return art.article_id == article_id ? (art = article) : art;
          })
        );
        setCurrentArticleId();
        setSpinnerOn(false);
      })
      .catch(() => {
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setSpinnerOn(true);
    axiosWithAuth()
      .delete(`/articles/${article_id}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setArticles(
          articles.filter((article) => article.article_id != article_id)
        );
        setSpinnerOn(false);
      })
      .catch(() => {
        setSpinnerOn(false);
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  currentArticleId={currentArticleId}
                  setCurrentArticleId={setCurrentArticleId}
                  articles={articles}
                  updateArticle={updateArticle}
                />
                <Articles
                  articles={articles}
                  currentArticleId={Number(currentArticleId)}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  );
}
