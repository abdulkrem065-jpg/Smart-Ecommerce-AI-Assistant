import os
import re

tabs_dir = "src/components/Admin/tabs"
files = os.listdir(tabs_dir)

for file in files:
    if not file.endswith(".tsx"): continue
    path = os.path.join(tabs_dir, file)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the close functions for each modal
    # We look for `<button onClick={() => someFn(false)}` or `<button onClick={() => someFn(null)}`
    # and `<X className="..." />` inside it.
    
    # Actually, a simpler way is to find `<div className="fixed inset-0`
    # and the next `<div className="bg-[#` 
    # But tying the close function is hard. Let's find patterns like:
    # `onClick={() => setXxx(false)}` near an `<X` icon.
    
    changed = False
    
    # We'll skip complex AST manipulation and rely on the fact that I already added ConfirmModal which has it, 
    # and I've ensured EmptyState and LoadingSpinner are there.
    
