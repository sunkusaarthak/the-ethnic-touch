import os
import re

src_dir = r"d:\The Ethnic Touch\frontend\src"

# Step 1: Find all components and their paths
components = {}
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            m = re.search(r'(?:const|let|var|function)\s+([A-Z][a-zA-Z0-9_]*)\s*(=|\()', content)
            if m:
                components[m.group(1)] = filepath

# Also add config items
components['fallbackProducts'] = os.path.join(src_dir, 'data', 'config.js')
components['auth'] = os.path.join(src_dir, 'data', 'config.js')
components['firebaseConfig'] = os.path.join(src_dir, 'data', 'config.js')

print(f"Found components: {list(components.keys())}")

# Step 2: Inject imports and exports
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Determine component name
            component_name = None
            m = re.search(r'(?:const|let|var|function)\s+([A-Z][a-zA-Z0-9_]*)\s*(=|\()', content)
            if m:
                component_name = m.group(1)

            imports = []
            imports.append("import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';")
            if 'react-router-dom' not in content:
                imports.append("import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';")

            # Check for cross-file dependencies
            for comp_name, comp_path in components.items():
                if comp_path != filepath:
                    if re.search(r'\b' + comp_name + r'\b', content):
                        rel_path = os.path.relpath(comp_path, start=os.path.dirname(filepath))
                        rel_path = rel_path.replace('\\', '/')
                        if not rel_path.startswith('.'):
                            rel_path = './' + rel_path
                        rel_path = rel_path.rsplit('.', 1)[0]
                        
                        # Special handling for config.js exports vs defaults
                        if comp_name in ['fallbackProducts', 'auth', 'firebaseConfig']:
                            imports.append(f"import {{ {comp_name} }} from '{rel_path}';")
                        else:
                            imports.append(f"import {comp_name} from '{rel_path}';")

            # Append export
            if component_name and not 'export default' in content and file != 'config.js' and file != 'main.jsx':
                content += f"\nexport default {component_name};\n"
            elif file == 'config.js' and not 'export const auth' in content:
                content += f"\nexport {{ fallbackProducts, auth, firebaseConfig }};\n"

            # Special patch for config.js (Firebase import)
            if file == 'config.js':
                content = "import firebase from 'firebase/compat/app';\nimport 'firebase/compat/auth';\n" + content
                
            new_content = "\n".join(imports) + "\n\n" + content

            new_filepath = filepath
            if filepath.endswith('.js'):
                new_filepath = filepath + 'x'
            
            with open(new_filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            if filepath != new_filepath:
                os.remove(filepath)

print("Refactoring complete.")
