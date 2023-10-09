import { requestUsers, requestUsersWithError, User, Query } from "./api";
import "./styles.css";

import Requirements from "./Requirements";
import {Loading} from "./Loading";
import {useEffect, useState} from "react";
import {UserItem} from "./UserItem";

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

    const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery({
            ...query,
            name: value,
            offset: 0
        });
    };

    const ageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery({
            ...query,
            age: value,
            offset: 0
        });
    };

    useEffect(() => {
        setLoading(true);
        requestUsers(query)
            .then((data) => {
                setLoading(true);
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.toString());
                setLoading(false);
            });
    }, [query]);

    const usersList = () => {
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
      </div>
);
}
