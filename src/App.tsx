import { requestUsers, requestUsersWithError, User, Query } from "./api";
import "./styles.css";
import {Loading} from "./Loading";
import {ChangeEvent, ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {UserItem} from "./UserItem";
import {useDebounce} from "./hooks/useDebounce";
import {FiltersData, PaginationData} from "./types";
import {Pagination} from "./Pagination";

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
    const [error, setError] = useState<string |null>(null);
    const [filters, setFilters] = useState<FiltersData>(initialFiltersValues);
    const [pagination, setPagination] = useState<PaginationData>(initialPaginationValues);
    const debouncedFilters = useDebounce(filters);
    const prevQueryRef = useRef<Query | null>(null);

    const patchFormFromInput = useCallback(({target}: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({
            ...prev,
            [target.name]: target.value
        }));
        setPagination(initialPaginationValues);
        }, []
    );

    useEffect(() => {
        const request = async () => {
            setLoading(true);
            const query = {...pagination, ...debouncedFilters};
            prevQueryRef.current = query;

            try {
                const fetchedUsers = await requestUsers(query);
                if (prevQueryRef.current !== query) return;
                setUsers(fetchedUsers);
            } catch (err) {
                if (prevQueryRef.current ! == query) return;
                if (err) setError(((err as Record<string, string>) || {}).message);
            } finally {
                if (prevQueryRef.current ! == query) return;
                setLoading(false);
            }
        };
        request();
    },[pagination, debouncedFilters]);

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
          <Pagination value={pagination} setValue={setPagination}/>
      </div>
);
}
