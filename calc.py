import unittest


def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b


def multiply_many(values: list[int]) -> int:
    """Return the product of every value.

    >>> multiply_many([2, 3, 4])
    24
    """
    result = 1
    for value in values:
        result *= value
    return result


class TestCalculator(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)

    def test_multiply_many(self):
        self.assertEqual(multiply_many([2, 3, 4]), 24)


if __name__ == "__main__":
    unittest.main(verbosity=2)
