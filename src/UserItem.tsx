import { FC } from "react";
import { User } from "./api";

export const UserItem: FC<{ user: User }> = ({ user }) => {
    return <div key={user.id}>{`${user.name}, ${user.age}`}</div>;
};