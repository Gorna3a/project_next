import pathlib, re, sys

base = pathlib.Path("courses/content/python")
errors = []
outputs = {}

def check_code(name, code, expect_desc):
    g = {}
    try:
        exec(code, g)
    except Exception as e:
        errors.append(f"{name}: exception {e!r}")
        print(f"FAIL {name}: exception {e!r}")
        return
    print(f"OK {name}")

# 1. theory lesson 1 blocks
blocks = {}
for fname in ["py-les-arrays-and-linked-lists.md","py-les-stacks-and-queues.md","py-les-heaps-and-priority-queues.md","py-les-hash-tables.md","py-les-binary-search-trees.md"]:
    text = (base/fname).read_text()
    code_blocks = re.findall(r"```python\n(.*?)```", text, re.S)
    blocks[fname] = code_blocks
    print(f"{fname}: {len(code_blocks)} python blocks")
    for i, b in enumerate(code_blocks):
        check_code(f"{fname}#{i}", b, "")

# workshop in-order traversal reuse check explained below
# 2. workshop solutions
ws = (base/"py-ws-linked-list-and-stack.md").read_text()
sols = re.findall(r"### Solution State / Code\n```python\n(.*?)```", ws, re.S)
print(f"workshop solutions: {len(sols)}")
for i, s in enumerate(sols):
    code_only = s.split("def make_list")[0]  # safety: just run full sol below
    g = {}
    try:
        exec(s, g)
        print(f"OK workshop solution {i}")
    except Exception as e:
        errors.append(f"workshop#{i}: {e!r}")
        print(f"FAIL workshop#{i}: {e!r}")

# extra runtime checks for graded calls (Node, LinkedList, Stack, make_list, make_stack)
g = {}
exec("def make_list(values):\n    result = LinkedList()\n    for v in values:\n        result.add_to_front(v)\n    return result\n", g)
try:
    exec(open("_ws_full.py").read() if False else "", g)
except: pass
# Build full class namespace from last solution
g2 = {}
exec(sols[-1], g2)
def make_list_fn(values):
    result = g2["LinkedList"]()
    for v in values:
        result.add_to_front(v)
    return result
def make_stack_fn(values):
    result = g2["Stack"]()
    for v in values:
        result.push(v)
    return result

assert make_list_fn([1,2,3]).to_list() == [3,2,1], "to_list check"
assert make_list_fn([1,2,3]).remove_by_value(3) == True
assert make_list_fn([1,2,3]).remove_by_value(2) == True
assert make_list_fn([1,2,3]).remove_by_value(9) == False
assert make_stack_fn(["a","b","c"]).items.to_list() == ["c","b","a"]
assert make_stack_fn(["a","b"]).pop() == "b"
assert g2["Stack"]().peek() is None
assert g2["Stack"]().pop() is None
s1 = g2["Stack"](); s1.push("a"); assert s1.peek() == "a"
s2 = g2["Stack"](); s2.push("a"); s2.push("b"); assert s2.pop() == "b"
print("OK workshop graded calls")

# 3. lab reference solution + build_tree
lab = (base/"py-lab-bst-toolkit.md").read_text()
ref = re.search(r"## Reference Solution\n```python\n(.*?)```", lab, re.S).group(1)
g3 = {}
exec(ref, g3)
build = g3["build_tree"]
assert g3["contains"](None, 5) == False
assert g3["in_order_list"](None) == []
assert g3["in_order_list"](build([10,5,20,15])) == [5,10,15,20]
assert g3["contains"](build([10,5,20,15]), 15) == True
assert g3["contains"](build([10,5,20,15]), 7) == False
assert g3["in_order_list"](build([50,30,70,60,80,40])) == [30,40,50,60,70,80]
assert g3["in_order_list"](build([10,10,5,10])) == [5,10]
assert g3["contains"](build([10,10]), 10) == True
assert g3["in_order_list"](g3["insert"](None, 42)) == [42]
assert g3["contains"](g3["insert"](None, 42), 42) == True
print("OK lab graded calls")

# 4. quiz code-output blocks
quiz = (base/"py-quiz-data-structures.md").read_text()
qb = re.findall(r"```python\n(.*?)```", quiz, re.S)
print(f"quiz code blocks: {len(qb)}")
for i, b in enumerate(qb):
    import io, contextlib
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(b, {})
    print(f"quiz#{i} output: {buf.getvalue().strip()[:80]}")

# 5. review code blocks execute
rev = (base/"py-rev-data-structures.md").read_text()
rb = re.findall(r"```python\n(.*?)```", rev, re.S)
for i, b in enumerate(rb):
    if "head" in b or "root" in b:
        print(f"review#{i}: skipped (needs external var)")
        continue
    g = {}
    try:
        exec(b, g)
        print(f"OK review#{i}")
    except Exception as e:
        errors.append(f"review#{i}: {e!r}")
        print(f"FAIL review#{i}: {e!r}")

print("ERRORS:", errors if errors else "none")
