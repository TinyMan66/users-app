import { requestUsers, requestUsersWithError, User, Query } from "./api";
import "./styles.css";

import Requirements from "./Requirements";
import {Loading} from "./Loading";
import {ChangeEvent, ReactNode, useCallback, useEffect, useState} from "react";
import {UserItem} from "./UserItem";
import {useDebounce} from "./hooks/useDebounce";
import {FiltersData, PaginationData} from "./types";

// Примеры вызова функций, в консоли можно увидеть возвращаемые результаты
requestUsers({ name: "", age: "", limit: 4, offset: 0 }).then(console.log);
requestUsersWithError({ name: "", age: "", limit: 4, offset: 0 }).catch(
  console.error
);

const initialFiltersValues: FiltersData = {
    name: "",
    age: "",
};

const initialPaginationValues: PaginationData = {
    limit: 4,
    offset: 0
};

export default function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState<FiltersData>(initialFiltersValues);
    const [pagination, setPagination] = useState<PaginationData>(initialPaginationValues);
    const debouncedFilters = useDebounce(filters);

    const patchFormFromInput = useCallback(({target}: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({
            ...prev,
            [target.name]: target.value
        }));
        setPagination(initialPaginationValues);
        }, []
    );

    const limitChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setPagination({ ...pagination, limit: newLimit, offset: 0 });
    };

    const limitOptions = [4, 8, 12].map((limit) => (
        <option key={limit} value={limit.toString()}>
            {limit}
        </option>
    ));

    const prevPage = () => {
        const newOffset = Math.max(pagination.offset - pagination.limit, 0);
        setPagination({ ...pagination, offset: newOffset });
    };

    const nextPage = () => {
        const newOffset = pagination.offset + pagination.limit;
        setPagination({ ...pagination, offset: newOffset });
    };

    const pageNumber = Math.ceil(pagination.offset / pagination.limit) + 1;

    useEffect(() => {
        setLoading(true);
        const query = {...pagination, ...debouncedFilters}
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
    }, [pagination, debouncedFilters]);

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
              value={filters.name}
              onChange={patchFormFromInput}
          />
          <input
              type="number"
              min="0"
              name="age"
              placeholder="Age"
              value={filters.age}
              onChange={patchFormFromInput}
          />
          {usersList()}
          <div>
              By page:
              <select value={pagination.limit.toString()} onChange={limitChangeHandler}>
                  {limitOptions}
              </select>
              <button onClick={prevPage} disabled={pagination.offset === 0}>
                  Prev
              </button>
              <span>page: {pageNumber}</span>
              <button onClick={nextPage} disabled={users.length < pagination.limit}>
                  Next
              </button>
          </div>
      </div>
);
}
