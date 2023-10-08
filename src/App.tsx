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

    useEffect(() => {
        requestUsers()
            .then((data) => {
                setUsers(data);
            })
            .catch((err) => {
            });
    }, []);


    return (
      <div>
        <Loading/>
          {users.map(user => <UserItem key={user.id} user={user}/>)}
      </div>
);
}
