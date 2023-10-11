import { requestUsers, requestUsersWithError, User, Query } from "./api";
import "./styles.css";

import Requirements from "./Requirements";
import {Loading} from "./Loading";
import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {UserItem} from "./UserItem";
import {useDebounce} from "./hooks/useDebounce";

// Примеры вызова функций, в консоли можно увидеть возвращаемые результаты
requestUsers({ name: "", age: "", limit: 4, offset: 0 }).then(console.log);
requestUsersWithError({ name: "", age: "", limit: 4, offset: 0 }).catch(
  console.error
);

export default function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState<Query>({ name: "", age: "", limit: 4, offset: 0 })
    const debouncedQuery = useDebounce(query);

    const nameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery({
            ...query,
            name: value,
            offset: 0
        });
    };

    const ageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery({
            ...query,
            age: value,
            offset: 0
        });
    };

    const limitChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setQuery({ ...query, limit: newLimit, offset: 0 });
    };

    const limitOptions = [4, 8, 12].map((limit) => (
        <option key={limit} value={limit.toString()}>
            {limit}
        </option>
    ));

    const prevPage = () => {
        const newOffset = Math.max(query.offset - query.limit, 0);
        setQuery({ ...query, offset: newOffset });
    };

    const nextPage = () => {
        const newOffset = query.offset + query.limit;
        setQuery({ ...query, offset: newOffset });
    };

    const pageNumber = Math.ceil(query.offset / query.limit) + 1;

    useEffect(() => {
        setLoading(true);
        requestUsers(debouncedQuery)
            .then((data) => {
                setLoading(true);
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.toString());
                setLoading(false);
            });
    }, [debouncedQuery]);

    const usersList = (): ReactNode => {
        if(loading) return <Loading/>;
        if(error) return <p style={{color: "red"}}>{error}</p>;
        if (users.length === 0) return <p>Users not found</p>;
        return users.map(user => <UserItem key={user.id} user={user}/>);
    };

    return (
      <div>
          <h2>Users List</h2>
          <input
              type="text"
              name="name"
              placeholder="Name"
              value={query.name}
              onChange={nameChangeHandler}
          />
          <input
              type="number"
              min="0"
              name="age"
              placeholder="Age"
              value={query.age}
              onChange={ageChangeHandler}
          />
          {usersList()}
          <div>
              By page:
              <select value={query.limit.toString()} onChange={limitChangeHandler}>
                  {limitOptions}
              </select>
              <button onClick={prevPage} disabled={query.offset === 0}>
                  Prev
              </button>
              <span>page: {pageNumber}</span>
              <button onClick={nextPage} disabled={users.length < query.limit}>
                  Next
              </button>
          </div>
      </div>
);
}
