import pathlib
p = pathlib.Path("courses/content/python/py-les-binary-search-trees.md")
t = p.read_text()
t = t.replace("class Node:", "class BSTNode:")
t = t.replace("return Node(value)", "return BSTNode(value)")
p.write_text(t)
print(t.count("class BSTNode:"))
