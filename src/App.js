import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
console.log(process.env.REACT_APP_ACCESS_KEY);
function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (pageNo === 1) {
      fetchImages();
    }
    setPageNo(1);
  };
  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${pageNo}`;
    const urlQuery = `&query=${query}`;

    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
      console.log(url);
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      setLoading(false);
      setPhotos((oldPhotos) => {
        if (query && pageNo === 1) {
          return [...data.results];
        }
        if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, [pageNo]);
  //Listening for the scroll array
  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        (!loading && window.innerHeight + window.scrollY) >=
        document.body.scrollHeight - 4
      ) {
        setPageNo((curr) => {
          return curr + 1;
        });
      }
    });
    return () => window.removeEventListener("scroll", event);
  }, []);
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image) => {
            return <Photo key={image.id} {...image} />;
          })}
        </div>
        {loading && (
          <Loader
            className="loading"
            type="TailSpin"
            color="#00BFFF"
            height={80}
            width={80}
          />
        )}
      </section>
    </main>
  );
}

export default App;
