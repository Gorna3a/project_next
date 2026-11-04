from functools import cache

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def recursive_sum(numbers):
    if not numbers:
        return 0
    return numbers[0] + recursive_sum(numbers[1:])

def binary_search(values, target):
    low = 0
    high = len(values) - 1
    while low <= high:
        middle = (low + high) // 2
        if values[middle] == target:
            return middle
        if values[middle] < target:
            low = middle + 1
        else:
            high = middle - 1
    return -1

print("factorial(0)=", factorial(0), "expect 1")
print("factorial(4)=", factorial(4), "expect 24")
print("factorial(5)=", factorial(5), "expect 120")
print("fibonacci(0)=", fibonacci(0), "expect 0")
print("fibonacci(1)=", fibonacci(1), "expect 1")
print("fibonacci(10)=", fibonacci(10), "expect 55")
print("recursive_sum([1,2,3,4])=", recursive_sum([1, 2, 3, 4]), "expect 10")
print("recursive_sum([])=", recursive_sum([]), "expect 0")
print("recursive_sum([-2,5,3])=", recursive_sum([-2, 5, 3]), "expect 6")
print("binary_search([2,4,6,8,10],6)=", binary_search([2, 4, 6, 8, 10], 6), "expect 2")
print("binary_search([2,4,6,8,10],5)=", binary_search([2, 4, 6, 8, 10], 5), "expect -1")
print("binary_search([],5)=", binary_search([], 5), "expect -1")
print("binary_search([7],7)=", binary_search([7], 7), "expect 0")

def sort_numbers(numbers):
    result = []
    for value in numbers:
        position = len(result)
        while position > 0 and result[position - 1] > value:
            position -= 1
        result.insert(position, value)
    return result

print("sort_numbers([3,1,2])=", sort_numbers([3, 1, 2]), "expect [1, 2, 3]")
print("sort_numbers([5,2,9,1,7])=", sort_numbers([5, 2, 9, 1, 7]), "expect [1, 2, 5, 7, 9]")
print("sort_numbers([])=", sort_numbers([]), "expect []")
print("sort_numbers([4])=", sort_numbers([4]), "expect [4]")
print("sort_numbers([3,1,3,2])=", sort_numbers([3, 1, 3, 2]), "expect [1, 2, 3, 3]")
print("sort_numbers([-2,0,-5,3])=", sort_numbers([-2, 0, -5, 3]), "expect [-5, -2, 0, 3]")
src = open("courses/content/python/py-lab-sort-it-yourself.md", encoding="utf-8").read()
print("sorted( in src?", "sorted(" in src.lower())
print("ALL TESTS DONE")
