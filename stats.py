def mean(values: list[int]) -> float:
    """Return the rounded mean.

    >>> mean([2, 4, 6])
    4.0
    """
    return round(sum(values) / len(values), 2)


def median(values: list[int]) -> float:
    """Return the median as a float.

    >>> median([1, 2, 3, 4])
    2.5
    """
    ordered = sorted(values)
    count = len(ordered)
    middle = count // 2
    if count % 2 == 1:
        return float(ordered[middle])
    return round((ordered[middle - 1] + ordered[middle]) / 2, 2)


def maximum(values: list[int]) -> int:
    """Return the largest value.

    >>> maximum([3, 9, 2])
    9
    """
    return max(values)


print("done")
