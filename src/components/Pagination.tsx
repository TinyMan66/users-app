import React, {ChangeEvent, Dispatch, FC, SetStateAction, useCallback} from 'react';
import {PaginationData} from "../common/types/types";

interface PaginationProps {
    value: PaginationData;
    setValue: Dispatch<SetStateAction<PaginationData>>;
    isLoading: boolean;
    totalUsers: number;
}

export const Pagination: FC<PaginationProps> = ({value, setValue, isLoading, totalUsers}) => {
    const pageNumber = Math.ceil(value.offset / value.limit + 1);

    const limitChangeHandler = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) =>
            setValue({
                limit: parseInt(e.target.value, 10),
                offset: 0
            }),
        [setValue]
    );

    const onPrevPage = useCallback(() => {
        setValue((prev) => ({
            ...prev,
            offset: Math.max(prev.offset - prev.limit, 0)
        }));
    }, [setValue]);

    const onNextPage = useCallback(() => {
        setValue((prev) => ({
            ...prev,
            offset: prev.offset + prev.limit
        }));
    }, [setValue]);

    const limitOptions = [4, 8, 12].map((limit) => (
        <option key={limit} value={limit.toString()}>
            {limit}
        </option>
    ));

    return (
        <div>
            <div>
                <span>By page:</span>
                <select value={value.limit.toString()} onChange={limitChangeHandler}>
                    {limitOptions}
                </select>
                <button onClick={onPrevPage} disabled={pageNumber === 1 || isLoading}>
                    Prev
                </button>
                <span>page: {pageNumber}</span>
                <button onClick={onNextPage} disabled={pageNumber === totalUsers || isLoading}>
                    Next
                </button>
            </div>
        </div>
    );
};
