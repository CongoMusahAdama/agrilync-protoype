import re
import sys

def find_duplicate_attrs(content):
    # Regex to find JSX tags and their attributes
    # This is a simple regex and might not handle all edge cases (like strings with >)
    tags = re.findall(r'<([A-Z][a-zA-Z0-9.]+|[a-z][a-z0-9-]*)\s+([^>]+)/?>', content, re.DOTALL)
    
    results = []
    for tag_name, attrs_str in tags:
        # Regex to find attribute names
        # Handles name="value", name={value}, and boolean name
        attr_names = re.findall(r'([a-zA-Z0-9-]+)(?:\s*=\s*(?:\{[^\}]+\}|"[^"]*"|\'[^\']*\')|\s+|$)', attrs_str)
        
        seen = set()
        duplicates = set()
        for name in attr_names:
            if name in seen:
                duplicates.add(name)
            seen.add(name)
            
        if duplicates:
            results.append((tag_name, list(duplicates), attrs_str.strip()))
            
    return results

if __name__ == "__main__":
    file_path = "src/pages/agent/AgentProfile.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    duplicates = find_duplicate_attrs(content)
    if duplicates:
        for tag, dups, full in duplicates:
            print(f"Duplicate attributes {dups} in tag <{tag}>:")
            print(f"Full attributes string: {full}")
            print("-" * 20)
    else:
        print("No duplicate attributes found.")
