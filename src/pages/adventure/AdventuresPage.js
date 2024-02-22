import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import NoResults from "../../assets/no-results.png";
import AdventureCard from "../../components/AdventureCard";

import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function AdventuresPage({ message, filter = "" }) {
  const currentUser = useCurrentUser();
  const [adventure, setAdventure] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        const { data: { results } } = await axiosReq.get(`/adventure/?${filter}&search=${query}`);
        setAdventure(prevData => ({ ...prevData, results: [...results] }));
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchAdventure();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8} xl={9}>
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search Adventure"
          />
        </Form>

        {hasLoaded ? (
          <>
            {adventure.results.length ? (
              <InfiniteScroll
                dataLength={adventure.results.length}
                next={() => fetchMoreData(adventure, setAdventure)}
                hasMore={!!adventure.next}
                loader={<Asset spinner />}
                scrollThreshold="100px"
              >
                <div className={styles.CardGrid}>
                  {adventure.results.map((adventure) => (
                    <AdventureCard key={adventure.id} adventure={adventure} />
                  ))}
                </div>
              </InfiniteScroll>
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container>
            <Asset spinner />
          </Container>
        )}
      </Col>
    </Row>
  );
}

export default AdventuresPage;