import os
import re

src_dir = r"d:\The Ethnic Touch\frontend\src"
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            content = re.sub(r'const\s+\{[^}]*\}\s*=\s*React;', '', content)
            content = re.sub(r'const\s+\{[^}]*\}\s*=\s*ReactRouterDOM;', '', content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("Fixed legacy globals")
